import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const OnlineVideos = new Mongo.Collection("onlinevideos");


Meteor.methods({

  "addOnlineVideo":function(screenId, url,name,type){

    OnlineVideos.insert({
      url:url,
      name:name,
      type:type,
      belongToScreen:screenId
    });
  },

  "removeOnlineVideo":function(id){
    OnlineVideos.remove({_id:id});
  },

});

//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
