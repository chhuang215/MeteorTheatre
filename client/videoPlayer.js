import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen, Videos, OnlineVideos} from '../lib/common.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
Meteor.subscribe("videos");
Meteor.subscribe("screen");

var TIME_OFF_THRESHOLD = 3.5;
var vPlayer = null;

Template.videoPlayer.helpers({
  getCurrentVid(){
    var vidScreen = Screen.findOne({_id:this._id});
    if (vidScreen) {
       var currentVid = Videos.findOne({_id:vidScreen.currentlyPlaying}) || OnlineVideos.findOne({_id:vidScreen.currentlyPlaying});
       if(currentVid){
         return currentVid;
       }
    }
    return {url:''};
  },
  loadCurrentVid(url){

    var tmpl = Template.instance();
    var vidScreen = Screen.findOne({currentlyPlaying:this._id});

    if(tmpl.view.isRendered && vidScreen){
      let time = vidScreen.time;


      if(vPlayer){
        if(vPlayer.currentSrc() != url){
          vPlayer.reset();
          vPlayer.src(url);
        }

        let currTime = vPlayer.currentTime();
        if(currTime+TIME_OFF_THRESHOLD < time || currTime-TIME_OFF_THRESHOLD >time ){
            vPlayer.currentTime(time);
        }

        if(vidScreen.playing == true && vPlayer.paused()){
          vPlayer.play();
        }
        else if(vidScreen.playing == false){
          vPlayer.pause();
        }
      }
    }
  },
 });

Template.videoPlayer.events({
  "timeupdate video":function(){
    var screenId = this._id;
    var vidScreen = Screen.findOne({_id:screenId});

  //  var myvid = $('#video')[0];
    if(vidScreen && !vPlayer.seeking()){

      if(vidScreen.playing){
        let time = vPlayer.currentTime();
        Meteor.call('time', screenId, time);
      }
      else if(!vidScreen.playing){

        vPlayer.pause();
      }

    }

  },
  "seeked video":function(){
    var screenId = this._id;
    var vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen){
      let time = vPlayer.currentTime();

      Meteor.call('time', screenId, time);
    }

  },

  'canplaythrough video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", false);
    }
  },
  'loadstart video, waiting video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", true);
    }
  },
  "click .js-play": function(){
    var screenId = this._id;
    Meteor.call("play", screenId,true);
  },
  "play video":  function(){
    event.preventDefault(event)

    var screenId = this._id;
    Meteor.call("play", screenId, true);
  },
  "click .js-pause":function(){

    var screenId = this._id;
    Meteor.call("play", screenId,false);
  },
  "pause video":function(event){
    event.preventDefault()
    var screenId = this._id;
    Meteor.call("play", screenId,false);
  }
});


Template.videoPlayer.onCreated(function(){

  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-80);
  });

});

Template.videoPlayer.onRendered(function(){
  $('.screen').css('height', $(window).height()-80);
  vPlayer = videojs('video', { preload:'auto'});
});

Template.videoPlayer.onDestroyed(function(){

  var v = videojs('video');
  v.dispose();
});
