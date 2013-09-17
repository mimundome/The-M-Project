define([
    'themproject',
    'text!templates/list.html',
    'app',
    'views/list_item'
],
    function( M, tpl, app, ListItemView ) {

        M.ListView = M.View.extend({

            template: _.template(tpl), // TODO Move _.template into M.View

//            events: {
//                "click .add": "addEntry"
//            },

            initialize: function() {
                M.View.prototype.initialize.apply(this, arguments);
                this.listenTo(this.model, 'add', this.addOne);
                this.listenTo(this.model, 'fetch', function() {
                    this.addAll();
                });

                this.listenToOnce(this.model, 'sync', function() {
                    this.render();
                });
            },

            serialize: function() {
                return this;
            },

            addEntry: function() {
                app.layoutManager.navigate({
                    route: 'add'
                });
            },

            beforeRender: function() {
                this.addAll.apply(this);
            },

            addOne: function( model, render ) {
                var view = this.insertView('tbody', new ListItemView({ model: model }));

                // Only trigger render if it not inserted inside `beforeRender`.
                if( render !== false ) {
                    view.render();
                }
            },

            addAll: function() {
                app.collections.contacts.each(function( model ) {
                    this.addOne.apply(this, [model, false]);
                }, this);
            }
        });

        return M.ListView;
    });


/*

define([
    "app",
    "backbone",
    "text!templates/list.html",
    "views/list_item"
],
    function( app, Backbone, tpl, ListItemView ) {

        var View = Backbone.View.extend({

            template: _.template(tpl),

            events: {
                "tap .add": "addEntry"
            },

            initialize: function() {
                this.listenTo(this.options.contacts, 'add', this.addOne);
                this.listenTo(this.options.contacts, 'fetch', function() {
                    this.addAll();
                });

                this.listenToOnce(this.options.contacts, 'sync', function() {
                    this.render();
                });
            },

            serialize: function() {
                return this.options
            },

            addEntry: function() {
                app.layoutManager.navigate({
                    route: 'add'
                });
            },

            beforeRender: function() {
                this.addAll();
            },

            addOne: function( model, render ) {
                var view = this.insertView('tbody', new ListItemView({ model: model }));

                // Only trigger render if it not inserted inside `beforeRender`.
                if( render !== false ) {
                    view.render();
                }
            },

            addAll: function() {
                this.options.contacts.each(function( model ) {
                    this.addOne(model, false);
                }, this);
            }
        });

        return View;
    });
*/