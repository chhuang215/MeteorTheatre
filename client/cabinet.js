import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Videos, BackendlessVideos} from '/lib/collections/Videos.js';
import {OnlineVideos} from '/lib/collections/OnlineVideos.js';
import Backendless, {Files} from 'backendless';

Template.cabinet.helpers({
  "getVids": function(){

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
      var f = new FS.File(files[i]);
      f.belongToScreen = this._id;
      Videos.insert(f, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          alert("Not a video/audio file.");
        }
      })
    }
  },
  "change .js-add-backendlessvid":function(e){
    var files = e.target.files;
    const screenId = this._id;
    for (var i = 0, ln = files.length; i < ln; i++) {
      let file = files[i];
      const name = file.name;
      const type = file.type;
      var callbackSuccess = function(result){
        console.log("SUCCESS");
        //console.log(result.fileURL);
        Meteor.call('addOnlineVideo', screenId, result.fileURL,name,type);
      }
      var callbackFailed = function(err){
        console.log("Failed");
        console.log(err.message);
      }


      Backendless.Files.upload(files,'video',true,new Backendless.Async(callbackSuccess,callbackFailed));

    }
    console.log('uploading...');

  },
  "submit .js-add-onlinevid":function(e){
    e.preventDefault();
    const url = e.target.videourl.value;
    const screenId = this._id;
    let name = null, type = null;
    var f = new FS.File();
    f.attachData(url, function (error) {
      if (error) {
        //console.log(error);
        console.log('can\'t get file data');

      }else{
      //  console.log(f);
        name =  f.name() ;
        type =  f.type();
        //console.log("TEST" ++ " " +);
        Meteor.call('addOnlineVideo', screenId, url,name,type);
      }
    //  console.log(f);

      e.target.videourl.value = "";


    });


        $('#modalUrlForm').modal("toggle");
  }

});
