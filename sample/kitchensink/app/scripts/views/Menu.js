Kitchensink.Views = Kitchensink.Views || {};

(function() {
    'use strict'
    Kitchensink.Views.MenuView = M.View.extend({

        template: '<div><div data-childviews="content"></div></div>'

    }, {
        content: M.View.extend({

        }, {

            headline: M.View.extend({
                tagName: 'h2',
                value: M.I18N.get('global.appName', {aka: 'Absinth'}),
                events:{
                    tap: function(){
                        console.log('tap');
                    }
                }
            }),

            bindingTestInput: M.View.extend({

                scopeKey: 'bindingTestModel',
                templateExtend: '<div><input value="<%= a %>"/> <input value="<%= b %>" /></div>'

            }),

            bindingTestOutput: M.View.extend({

                scopeKey: 'bindingTestModel',
                template: '<div><input value="<%= a %>"/> <input value="<%= b %>" /></div>'

            }),

            bindingTestAttributeA: M.View.extend({
                scopeKey: 'bindingTestModel.a'
            }),

            bindingTestAttributeB: M.View.extend({
                scopeKey: 'bindingTestModel.b'
            }),

            eventTest: M.View.extend({
                scopeKey: 'consoleModel',
                cssClass: 'box',
                events: {
                    hold: 'eventDidHappen',
                    tap: 'eventDidHappen',
                    doubletap: 'eventDidHappen',
                    drag: 'eventDidHappen',
                    swipe: 'eventDidHappen',
                    transform: 'eventDidHappen',
                    rotate: 'eventDidHappen',
                    pinch: 'eventDidHappen',
                    touch: 'eventDidHappen'
//                    release: 'eventDidHappen'
                }
            }),

            listExample: M.ListView.extend({

                scopeKey: 'tmpViews',

                listItemView: M.ListItemView.extend({

                    events: {

                        tap: 'eventDidHappen'
                    }
                })
            }),

            localizationExample: M.ButtonView.extend({
                value: M.I18N.get('global.switchLanguage'),
                events: {
                    tap: function() {
                        if(M.I18N._activeLocale == 'de') {
                            M.I18N.setLocale('en');
                        } else {
                            M.I18N.setLocale('de');
                        }
                    }
                }
            }),

            pageswitchExample: M.ButtonView.extend({
                value: M.I18N.get('global.pageswitch'),
                events: {
                    tap: 'nextPage'
                }
            }),

            sliderExample: M.SliderView.extend({
                events: {
                    change: function(event, element){
                        console.log(element.$el);
                    }
                }
            }),

            textfieldExample: M.TextfieldView.extend({

                label: 'Label',
                value: ''
            }),


//            toggleExample: M.ToggleView.extend({
//
//                value: 'ICH BIN DER VALUE',
//                preRender: function(){
//
//                },
//                postRender: function(){
//                    console.log(this.$el, this.el);
//
//                }
//
//            },{
//                first: M.ButtonView.extend({
//                    value: 'btn1',
//                    events:{
//                        tap: function(event, element){
//                            console.log(element);
//                        }
//                    }
//                }),
//                second: M.ButtonView.extend({
//                    value: 'btn2'
//                })
//            }),

            imageExample: M.ImageView.extend({
                value: 'http://www.bhmpics.com/thumbs/success_kid-t2.jpg',
                alt: 'success',

                events: {
                    tap: function() {
                        //this.$el.append('click');
                        var that = this;
                        this.$el.hide();

                        setTimeout(function(){
                            that.$el.show();
                        }, 2000);
                    },
                    swipe: 'eventDidHappen',
                    swiperight: 'eventDidHappen',
                    swipeleft: 'eventDidHappen'
                }
            }),

            searchfieldExample: M.SearchfieldView.extend({
                label: 'Label',
                value: ''
            }),

            loadingExample: M.LoaderView.extend({
                value: 'Loading ...',
                preRender: function(){
                },
                postRender: function(){
                }
            }),

            loaderButtonExample: M.ButtonView.extend({
                value: 'Toggle LoaderView',
                events:{
                    tap: function() {
                        //this.scope.menu.childViews.content.childViews.loadingExample.toggle();
                    }
                }
            }),

            dialogExample: M.DialogView.extend({
                value: new M.Model({
                    'header': 'Header Text',
                    'message': 'Dialog Message',
                    'cancel' : 'Abbrechen',
                    'ok' : 'Ok'
                })
            }),

            selectionlistExample: M.SelectionListView.extend({
                scopeKey: 'selectionListModel.water',
                selectOptions: {
                    collection: [{id:1,name:'fountain'}, {id:2,name:'evian'}, {id:3,name:'dasina'}],
                    labelPath: 'name',
                    valuePath: 'name'
                }

            })
        })
    });

})();

var options = {};
var childViews = {}

M.View.extend(options, childViews);