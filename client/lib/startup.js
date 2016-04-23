import { Meteor } from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {TimeSync} from 'meteor/mizzao:timesync';
import {AccountsGuest} from 'meteor/artwells:accounts-guest';

TimeSync.loggingEnabled = false;

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
