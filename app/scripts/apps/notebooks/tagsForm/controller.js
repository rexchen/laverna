/* global define */
define([
    'underscore',
    'app',
    'marionette',
    'collections/tags',
    'models/tag',
    'apps/notebooks/tagsForm/formView'
], function (_, App, Marionette, Collection, Model, FormView) {
    'use strict';

    var Form = App.module('AppNotebooks.TagsForm');

    Form.Controller = Marionette.Controller.extend({
        initialize: function () {
            _.bindAll(this, 'addForm', 'editForm', 'show');
        },

        // Add new tag
        addForm: function () {
            this.model = new Model();
            this.show();
        },

        // Edit an existing tag
        editForm: function (args) {
            this.model = new Model({id: args.id});
            $.when(this.model.fetch()).done(this.show);
        },

        show: function () {
            this.view = new FormView({
                model: this.model,
                data: this.model.toJSON()
            });

            App.modal.show(this.view);

            this.model.on('save', this.save, this);
            this.view.on('redirect', this.redirect, this);
        },

        save: function (data) {
            var self = this;
            this.model.set(data);

            if (this.model.isValid()) {
                this.model.save(data, {
                    success: function () {
                        self.view.trigger('close');
                    }
                });
            } else {
                this.view.showErrors(this.model.validationError);
            }
        },

        redirect: function () {
            return App.navigate('#/notebooks');
        }
    });

    return Form.Controller;
});
