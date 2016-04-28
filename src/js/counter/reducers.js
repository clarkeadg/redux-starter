
(function(Reducers, Constants){

    var values = {};

    Reducers.Counter = function(state, action) {
        if (typeof state === 'undefined') {
            return values;
        }

        var increment = action.value || 1;
        var value = values[action.id] || 0;

        switch (action.type) {
            case Constants.INCREMENT:
                values[action.id] = value + increment;
            break;
            case Constants.DECREMENT:
                values[action.id] = value - increment;
            break;
            default:
                values = values;
            break;
        }

        return { values: values, $el: action.$el, id: action.id };
    };

}(App.Reducers, App.Constants.Counter));
