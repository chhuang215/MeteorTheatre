import {Meteor} from 'meteor/meteor';
import {AccountsGuest} from 'meteor/artwells:accounts-guest';
Meteor.methods({

  // End Screen Methods

  "enableGuestLogin":function(){
    AccountsGuest.enabled = true;
  },

});
