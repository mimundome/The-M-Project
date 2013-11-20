M.ActiveState = M.Interface.design(/** @scope M.Interface.prototype */{

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.ActiveState',

    /**
     * Add an event to the elements root DOM element and listen to touchstart and mousedown. If the event happen add a css class named 'active' to that root element.
     * The css class gets removed on touchcancel, touchend or mouseup
     * @param {M.View} context - The View that implements this Interface
     * @private
     * @example
     *
     * MyOnActiveView = M.View.extend().implements([M.ActiveState]);
     *
     */
    _registerActiveState: function( context ) {

        // get the Views internal events and store them in a swap object
        var events = context._internalEvents || {};

        // be sure that the event names are defined
        events.touchstart = events.touchstart || [];
        events.touchend = events.touchend || [];
        events.touchcancel = events.touchcancel || [];
        events.mousedown = events.touchstart || [];
        events.mouseup = events.touchend || [];

        // be sure that the events are arrays
        events.touchstart = _.isArray(events.touchstart) ? events.touchstart : [events.touchstart];
        events.touchend = _.isArray(events.touchend) ? events.touchend : [events.touchend];
        events.touchcancel = _.isArray(events.touchcancel) ? events.touchcancel : [events.touchcancel];
        events.mousedown = _.isArray(events.mousedown) ? events.mousedown : [events.mousedown];
        events.mouseup = _.isArray(events.mouseup) ? events.mouseup : [events.mouseup];

        // touchstrart callback - add the class 'active'
        var touchstart = function setActiveStateOnTouchstart(event, element){
            element.$el.addClass('active');
        };

        // touchend callback - remove the class 'active'
        var touchend = function removeActiveStateOnTouchend(event, element){
            element.$el.removeClass('active');
        };

        // touchcancel callback - remove the class 'active'
        var touchcancel = function removeActiveStateOnTouchcancel(event, element){
            element.$el.removeClass('active');
        };

        // add the events to the swap object
        events.touchstart.push(touchstart);
        events.touchend.push(touchend);
        events.touchcancel.push(touchcancel);
        events.mousedown.push(touchstart);
        events.mouseup.push(touchend);

        // overwrite the interal events with the swap element
        context._internalEvents = events;

    },

    /**
     *
     * @param context
     * @returns {{registerActiveState: *}}
     * @override
     */
    getInterface: function( context ) {
        return {
            /* Call the function at the creation time to add the events when the element is initialized */
            registerActiveState: this._registerActiveState(context)
        };
    }

});