
Meteor.startup(function(){

   orion.links.add({index:2,identifier:"test",title:"test"});
   AccountsGuest.forced = false;
   Meteor.call("enableGuestLogin");

});
