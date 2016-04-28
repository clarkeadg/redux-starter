
(function(Actions, Constants, store){
    Actions.Counter = {
        increment: function(id, $el, value) {
            store.dispatch({ type: Constants.INCREMENT, id: id, value: value, $el: $el })
        },
        decrement: function(id, $el, value) {
            store.dispatch({ type: Constants.DECREMENT, id: id, value: value, $el: $el })
        }
    };
}(App.Actions, App.Constants.Counter, App.Store));
