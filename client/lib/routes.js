import {Screen} from '../../lib/collections/Screen.js';

FlowRouter.route('/', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "auditoriums"});
    }
});

FlowRouter.route('/:_id', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "auditorium"});
    }
});
