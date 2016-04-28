
(function(Redux, App){

    var reducer = Redux.combineReducers(App.Reducers);
    App.Store = Redux.createStore(reducer);

}(Redux, App));
