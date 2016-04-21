import { Meteor } from 'meteor/meteor';
//import {Screen, Videos, OnlineVideos} from '../lib/common.js';

import {Screen} from '../lib/collections/Screen.js';
import {Videos} from '../lib/collections/Videos.js';
import {OnlineVideos} from '../lib/collections/OnlineVideos.js';

Meteor.publish("screen", function(id){
  if(id){

      return Screen.find({_id:id});
  }

  return Screen.find();
});

Meteor.publish("videos", function(screenId){
  if(screenId){
    var vids = Videos.find({belongToScreen:screenId});
    if(vids){
      return vids;
    }
  }
  return [];
});

Meteor.publish("onlinevideos", function(screenId){
  if(screenId){
    var vids = OnlineVideos.find({belongToScreen:screenId});
    if(vids){
      return vids;
    }
  }
  return [];
});

Meteor.publish('getViewers', function (screenId){

  var usersViewers =  Meteor.users.find({isIn:screenId});
  return usersViewers;
});
