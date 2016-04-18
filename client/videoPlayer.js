import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen, Videos, OnlineVideos} from '../lib/common.js';
import videojs from 'video.js';
Meteor.subscribe("videos");
Meteor.subscribe("screen");

var TIME_OFF_THRESHOLD = 3.5;

Template.videoPlayer.helpers({
  loadCurrentVid(){

  },
  "getCurrentVid": function () {

    var vidScreen = Screen.findOne({_id:this._id});
    if (vidScreen) {

      var currentVid = Videos.findOne({_id:vidScreen.currentlyPlaying}) || OnlineVideos.findOne({_id:vidScreen.currentlyPlaying});
      var time = vidScreen.time;
      var myvideo = $("#video")[0];
      if(myvideo){
        if(myvideo.currentTime+TIME_OFF_THRESHOLD < time || myvideo.currentTime-TIME_OFF_THRESHOLD >time ){
            myvideo.currentTime = time;
        }

        if(vidScreen.playing == true){
          myvideo.play();
        }
        else{
          myvideo.pause();
        }
      } // End if
      if(currentVid){
        return currentVid;
      }

    } // End if

    return {url:''};
  }

});

Template.videoPlayer.events({
  "timeupdate video":function(){
    var screenId = Template.currentData()._id;
    var vidScreen = Screen.findOne({_id:screenId});
    var myvid = $('#video')[0];
    if(!myvid.seeking && vidScreen){
      if(vidScreen.playing){
        var time = myvid.currentTime;

        Meteor.call('time', screenId, time);
      }else{
        myvid.pause();
      }
    }

  },
  "seeked video":function(){
    var screenId = Template.currentData()._id;
    var vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen){
      var time = $('#video')[0].currentTime;

      Meteor.call('time', screenId, time);
    }

  },

  'canplaythrough video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", false);
    }
  },
  'waiting video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", true);
    }
  },
  "click .js-play": function(){
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,true);
  },
  "play video":  function(){
    event.preventDefault(event)

    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId, true);
  },
  "click .js-pause":function(){

    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  },
  "pause video":function(event){
    event.preventDefault()
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  }
});

Template.videoPlayer.onRendered(function(){
  //videojs('video');
});
