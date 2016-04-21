import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Videos} from './Videos';
import {OnlineVideos} from './OnlineVideos';

export const Screen = new Mongo.Collection("screen");

Meteor.methods({
  // Screen Methods
  'play':function(screenId,setPlay){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      Screen.update({ _id: vid._id }, {$set: {playing:setPlay}});
    }
  },
  'time':function(screenId, t){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      Screen.update({ _id: vid._id }, {$set: {time:t}});
    }
  },
  'vidToPlay':function(vidId){
    var vid = Videos.findOne({_id:vidId}) || OnlineVideos.findOne({_id:vidId});
    if(vid){
      var screen = Screen.findOne({_id:vid.belongToScreen});
      if(screen){
        Screen.update({_id: screen._id}, {$set:{currentlyPlaying:vidId}});
      }
    }
  },
  'clearVidToPlay':function(screenId){
    var screen = Screen.findOne({_id:screenId});
    if(screen){
      Screen.update({_id: screen._id}, {$set:{currentlyPlaying:null}});
    }
  },
  'addNewScreen':function(ownerId){
    Screen.insert({
      name:"Private",
      playing:false,
      time:0,
      currentlyPlaying:null,
      isPublic:false,
      owner:ownerId}
    );
  },
  "removeScreen":function(screenId){

    Screen.remove({_id:screenId});
  },
  "updateTitle":function(screenId,title){

    Screen.update({_id:screenId}, {$set: {title:title}});
  },
  // "userNeedsToLoad":function(isLoading){
  //   var u =  Meteor.users.findOne({_id:this.userId});
  //   if(u){
  //     Meteor.users.update({_id:u._id}, {$set: {isLoading:isLoading}});
  //   }
  //
  // },
  'addViewerToScreen':function(userId,screenId){
    if(this.userId == userId){
        var u =  Meteor.users.findOne({_id:userId});
        if(u.isIn){
          if(u.isIn.indexOf(screenId) == -1){

            u.isIn.push(screenId);

            Meteor.users.update({_id:userId}, {$set: {isIn:u.isIn}});
          }
        }
        else{
          Meteor.users.update({_id:userId}, {$set: {isIn:[screenId]}});
          //u.isIn = ;
        }

    }

  },

  'removeViewerFromScreen':function(userId,screenId){
    if(this.userId == userId){
      var u =  Meteor.users.findOne({_id:userId, isIn:screenId});
      if(u){
        if(u.isIn){
          var elem = u.isIn.indexOf(screenId);
          if(elem != -1){
            u.isIn.splice(elem,1);
          }
        }
        else{
          u.isIn = [];
        }
        Meteor.users.update({_id:userId}, {$set: {isIn:u.isIn}});
      }
    }
  }

});

//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
