import { Meteor } from 'meteor/meteor';

import {Screen} from '/lib/collections/Screen.js';
import {Videos} from '/lib/collections/Videos.js';

if (Screen.find().count() === 0) {
  Screen.insert({
    title:"Public",
    playing:false,
    time:0,
    currentlyPlaying:null,
    isPublic:true,
    owner:null,
    createdOn: new Date()
  });
}

Videos.allow({
  'insert':function(){return true;},
  'remove':function(){return true;},
  'update':function(){return true;},
  'download':function(){
    return true;
  }
});

UserStatus.events.on("connectionLogout",function(fields){
  var uid = fields.userId;
  var u = Meteor.users.findOne({_id:uid});
  if(u){
    u.inAuditorium = [];
    Meteor.users.update({_id:uid} , {$set: u });
  }
})

Meteor.startup(function(){
  // if(!Meteor.users.findOne()){
  //     AccountsGuest.enabled = false;
  // }else{
  //   AccountsGuest.enabled = true;
  // }
});
