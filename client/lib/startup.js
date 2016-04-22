import { Meteor } from 'meteor/meteor';
import {Screen} from '../../lib/collections/Screen.js';

Meteor.startup(function(){
  //  Meteor.subscribe("screen");
   orion.links.add({index:2,identifier:"test",title:"test"});

   AccountsGuest.forced = false;

   Meteor.call("enableGuestLogin");
});

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
