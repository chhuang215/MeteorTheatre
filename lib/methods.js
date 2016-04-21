import {Meteor} from 'meteor/meteor';

Meteor.methods({
  "userNeedsToLoad":function(isLoading){
    var u =  Meteor.users.findOne({_id:this.userId});
    if(u){
      Meteor.users.update({_id:u._id}, {$set: {isLoading:isLoading}});
    }

  },
  // End Screen Methods

  "enableGuestLogin":function(){
    AccountsGuest.enabled = true;
  },

});
