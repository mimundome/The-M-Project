M.SocketStore = M.Store.extend({

    _type: 'M.SocketStore',

    _transactionFailed: false,

    _selector: null,

    name: 'bikini',

    size: 1024 * 1024 * 5,

    version: '1.2',

    host:   '',

    path:   '',

    msgStore:  null,

    messages:  null,

    typeMapping: {
        'binary':  'text',
        'date':    'string'
    },

    initialize: function( options ) {
        M.Store.prototype.initialize.apply(this, arguments);

        var that  = this;
        options   = options || {};

        this.host     = options.host || this.host;
        this.path     = options.path || this.path;
        this.resource = options.resource || this.resource;

        this._initStores();

        this._socket = M.SocketIO.create({
            host: this.host,
            path: this.path,
            resource: this.resource,
            connected: function() {
                that._initialized = true;
                if( that.entities ) {
                    for( var name in that.entities ) {
                        var entity = that.entities[name];
                        that._bindEntity(entity);
                    }
                }
                that.sendMessages();
            }
        });
    },

    _initStores: function() {
        var MsgCollection  = M.Collection.extend({
            model: M.Model.extend({ idAttribute: '_id' })
        });
        this.msgStore = new M.LocalStorageStore({
            entities: {
                messages: {
                    collection: MsgCollection
                }
            }
        });
        this.messages  = new MsgCollection();
        this.messages.fetch();
    },

    _bindEntity: function(entity) {
        var that = this;
        entity.channel = entity.channel || 'entity_' + entity.name;
        var time = this.getLastMessageTime(entity.channel);
        this._socket.on(entity.channel, function(msg) {
            if (msg) {
                that.setLastMessageTime(entity.channel, msg.time);
                that.trigger(entity.channel, msg);
            }
        });
        this._socket.emit('bind', {
             entity: entity.name,
             time:   time
        });
        // do initial sync
        // if (!this.getLastMessageTime(entity.channel)) {
            this.sync("read", {}, { entity: entity.name, store: this });
        //}
    },

    _isValidChannel: function(channel) {
        return channel && channel.indexOf('entity_') === 0 && this.getEntity( null, { entity: channel.substr(7) } );
    },

    getLastMessageTime: function(channel) {
        return localStorage.getItem('__'+ channel + 'last_msg_time') || 0;
    },

    setLastMessageTime: function(channel, time) {
        if (time) {
            localStorage.setItem('__'+ channel + 'last_msg_time', time);
        }
    },

    onMessage: function(msg) {
        if (msg && msg.method) {
            var options = { store: this.lastStore, merge: true, fromMessage: true };
            var attrs   = msg.data;
            switch(msg.method) {
                case 'patch':
                    options.patch = true;
                case 'update':
                    var model = this.get(msg.id);
                case 'create':
                    if (model) {
                        model.save(attrs, options);
                    } else {
                        this.create(attrs, options);
                    }
                    break;

                case 'delete':
                    if (msg.id) {
                        var model = this.get(msg.id);
                        if (model) {
                            model.destroy(options);
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    },

    sync: function(method, model, options) {
        var that   = options.store || this.store;
        if (options.fromMessage) {
            return that.handleCallback(options.success);
        }
        var entity = that.getEntity(model, options, this.entity);
        if (that && entity) {
            var channel = entity.channel;

            if ( M.isModel(model) && !model.id) {
                model.set(model.idAttribute, new M.ObjectID().toHexString());
            }

            // connect collection with this channel
            if ( M.isCollection(this) && channel && !this.channel) {
                this.channel = channel;
                this.listenTo(that, channel, that.onMessage, this);
            }

            var time = that.getLastMessageTime(entity.channel);
            // only send read messages if no other store can do this
            // or for initial load
            if (method !== "read" || !this.lastStore || !time) {
                that.addMessage(method, model,
                    this.lastStore ? {} : options, // we don't need to call callbacks if an other store handle this
                    entity);
            }
            if (this.lastStore) {
                options.store   = this.lastStore;
                this.lastStore.sync.apply(this, arguments);
            }
        }
    },

    addMessage: function(method, model, options, entity) {
        var that = this;
        if (method && model) {
            var changes = model.changedSinceSync;
            var data = null;
            var storeMsg = false;
            switch (method) {
                case 'update':
                case 'create':
                    data  = model.attributes;
                    storeMsg = true;
                    break;
                case 'patch':
                    if ( _.isEmpty(changes)) return;
                    data = changes;
                    storeMsg = true;
                    break;
                case 'delete':
                    storeMsg = true;
                    break;
            }
            var msg = {
                _id: model.id,
                id: model.id,
                method: method,
                data: data
            };
            var emit = function(channel, msg) {
            if (that._initialized) {
                    that.emitMessage(channel, msg, options);
                } else {
                    that.handleCallback(options.success, msg.data);
                }
            };
            if (storeMsg) {
                this.storeMessage(entity.channel, msg, emit);
            } else {
                emit(entity.channel, msg);
            }
        }
    },

    emitMessage: function(channel, msg, options) {
        var that = this;
        console.log('emitMessage:'+msg.id);
        this._socket.emit(channel, msg, function(msg, error) {
            that.removeMessage(channel, msg, function(channel, msg) {
                if (error) {
                    // Todo: revert changed data
                    that.handleCallback(options.error, error);
                } else {
                    if (options.success) {
                        var resp = msg ? msg.data : null;
                        that.handleCallback(options.success, resp);
                    } else {
                        that.setLastMessageTime(channel, msg.time);
                        if (msg.method === 'read') {
                            var array = _.isArray(msg.data) ? msg.data : [ msg.data ];
                            for (var i=0; i < array.length; i++) {
                                var data = array[i];
                                if (data) {
                                    that.trigger(channel, {
                                        id: data._id,
                                        method: 'update',
                                        data: data
                                    });
                                    that.setLastMessageTime(channel, msg.time);
                                }
                            }
                        } else {
                            that.trigger(channel, msg);
                        }
                    }
                }
            });
        });
    },

    sendMessages: function() {
        var that = this;
        this.messages.each( function(message) {
            var msg      = message.get('msg');
            var channel  = message.get('channel');
            var callback = message.get('callback');
            if (that._isValidChannel(channel)) {
                if (callback) {
                    callback(channel, msg);
                } else if (that._initialized) {
                    that.emitMessage(channel, msg, {});
                }
            } else {
                that.removeMessage(channel, msg);
            }
        });
    },

    mergeMessages: function(data, id) {
        return data;
    },

    storeMessage: function(channel, msg, callback) {
        var message = this.messages.get(msg._id);
        if (message) {
            message.save({
                msg: _.extend(message.get('msg'), msg)
            });
        } else {
            this.messages.create({
                _id: msg._id,
                id:  msg.id,
                msg: msg,
                channel: channel,
                callback: callback
            });
        }
        callback(channel, msg);
    },

    removeMessage: function(channel, msg, callback) {
        var message = this.messages.get(msg._id);
        if (message) {
            message.destroy();
        }
        callback(channel, msg);
    }

});