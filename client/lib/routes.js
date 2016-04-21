import {Screen} from '../../lib/collections/Screen.js';

FlowRouter.route('/', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "auditoriums"});
    }
});

FlowRouter.route('/:_id', {
    action: function(params) {
        //var s = Screen.findOne({_id:params._id});
        console.log('i will hit here at least');
        BlazeLayout.render("layout", {main: "auditorium"});
    }
});
