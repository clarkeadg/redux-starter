
App.UI.Counter = (function($, Actions, store) {

    var instanceId = 0;

    var z = function(jcont,opts) {
        instanceId++;
        this.id = instanceId;
        this.$el = $(build());
        jcont.append(this.$el);
        this.opts = opts;
        init(this);
    };

    var init = function(t) {
        render();
        store.subscribe(render);
        setupButtons(t);
    };

    var build = function() {
        return [
            '<div class="counter">',
              '<p>Clicked:<span class="value">0</span> times',
                '<button class="increment">+</button>',
                '<button class="decrement">-</button>',
                '<button class="incrementIfOdd">Increment if odd</button>',
                '<button class="incrementAsync">Increment async</button>',
              '</p>',
            '</div>'
        ].join('\n')
    };

    var render = function() {
        var $el = store.getState().Counter.$el;
        var id = store.getState().Counter.id;
        if (id) {
            var value = store.getState().Counter.values[id];
            $el.find('.value').html(value.toString());
        }
    };

    var setupButtons = function(t) {

        t.$el.find('button.increment').on('click',function(){
            Actions.increment(t.id,t.$el);
        });

        t.$el.find('button.decrement').on('click',function(){
            Actions.decrement(t.id,t.$el);
        });

        t.$el.find('button.incrementIfOdd').on('click',function(){
            if (store.getState().Counter.values[t.id] % 2 !== 0) {
              Actions.increment(t.id,t.$el);
            }
        });

        t.$el.find('button.incrementAsync').on('click',function(){
            setTimeout(function() {
              Actions.increment(t.id,t.$el);
            }, 1000);
        });
    };

    return z;

}(jQuery, App.Actions.Counter, App.Store));
