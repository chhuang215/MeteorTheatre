import {Meteor} from 'meteor/meteor';

Meteor.methods({

  // End Screen Methods

  "enableGuestLogin":function(){
    AccountsGuest.enabled = true;
  },

});
