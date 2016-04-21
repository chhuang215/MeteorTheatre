import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import {Videos, OnlineVideos} from '../lib/common.js';
import {Videos} from '../lib/collections/Videos.js';
import {OnlineVideos} from '../lib/collections/OnlineVideos.js';

Template.cabinet.helpers({
  "getVids": function(){
    //console.log(this._id + " " + this.screenId);


    var vids = Videos.find();
    if(vids){
      return vids;
    }
  },
  "getOnlineVids":function(){

      var vids = OnlineVideos.find();
      if(vids){
        return vids;
      }
  }
});

Template.cabinet.events({
  "change .js-add-vid":function(e){
    var files = e.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      var f = new FS.File(files[0]);
      f.belongToScreen = this._id;
      Videos.insert(f, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          alert("Not a video file.");
        }
      })
    }
  },
  "submit .js-add-onlinevid":function(e){
    e.preventDefault();
    var url = e.target.videourl.value;
    var screenId = this._id;
    var name = null, type = null;
    var f = new FS.File();
    f.attachData(url, function (error) {
      if (error) {
        console.log(error);
        console.log('can\'t get file data');

      }else{
        name = f.original.name;
        type = f.original.type;
        console.log(name + " " + type);

      }
      console.log(f);


      e.target.videourl.value = "";

      Meteor.call('addOnlineVideo', screenId, url,name,type);
    });


        $('#modalUrlForm').modal("toggle");
  }

});


Template.cabinet.onCreated(function(){
  this.autorun(function(){
    // Meteor.subscribe("videos", this._id);
    // Meteor.subscribe("onlinevideos", this._id);
    console.log('VIDS');
    console.log(Videos.find().fetch());
  });
});
