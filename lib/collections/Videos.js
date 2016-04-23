import {Meteor} from 'meteor/meteor';
//import Backendless, {Files} from 'backendless';

export const Videos = new FS.Collection("videos", {
  stores: [
    new FS.Store.FileSystem("videos")
  ] ,
  filter: {
    allow: {
      contentTypes: ['video/*','audio/*'] //allow only videos/audios in this FS.Collection
    }
  }
});

//export const BackendlessVideos = new Mongo.Collection('backendlessvideos');
//
// Meteor.methods({
//   'uploadFileToBackendless':function(file){
//     console.log(file);
//     console.log(file.name);
//     let res = Backendless.Files.saveFile('video',file.name,file,true);
//     return res;
//   }
// });

//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
