import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
//import {Screen, Videos, OnlineVideos} from '../lib/common.js';

import {Screen} from '../lib/collections/Screen.js';
import {Videos} from '../lib/collections/Videos.js';
import {OnlineVideos} from '../lib/collections/OnlineVideos.js';

import videojs from 'video.js';

const TIME_OFF_THRESHOLD = 3.5;
var vPlayer = null;

Template.videoPlayer.helpers({
  getCurrentVid(){
    var vidScreen = Screen.findOne({_id:this._id});
    if (vidScreen) {
       var currentVid = Videos.findOne({_id:vidScreen.currentlyPlaying}) || OnlineVideos.findOne({_id:vidScreen.currentlyPlaying}) || {};
       return currentVid;
    }
    return {};
  },
  loadCurrentVid(url){
    if(!url){
      $(".vjs-big-play-button").hide();
      vPlayer.controls(false);
      return;
    }
    if (!vPlayer.controls()){
      vPlayer.controls(true);
    }

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

        if(vidScreen.playing && !vPlayer.ended()){
          if(vPlayer.paused()){
              vPlayer.play();
              $(".vjs-big-play-button").hide();
          }

        }
        else if((!vidScreen.playing && (vPlayer.readyState() >= 2) )|| vPlayer.ended ){
          vPlayer.pause();
          $(".vjs-big-play-button").show();
        }
      }
    }
  },
 });

Template.videoPlayer.events({
  "timeupdate video":function(){
    let time = vPlayer.currentTime();
    const screenId = this._id;
    const vidScreen = Screen.findOne({_id:screenId});

    if(vidScreen && !vPlayer.seeking()){

      if(vidScreen.playing){
        Meteor.call('time', screenId, time);
      }
      else if(!vidScreen.playing){

        vPlayer.pause();
        $(".vjs-big-play-button").show();
      }

    }

  },
  "seeked video":function(){
    const screenId = this._id;
    const vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen){
      let time = vPlayer.currentTime();

      Meteor.call('time', screenId, time);
    }

  },
  'loadstart video, waiting video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", true);
    }
    $('.vjs-loading-spinner').show();
  },
  'canplay video':function(){
    $('.vjs-loading-spinner').hide();
  },
  'canplaythrough video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", false);
    }
  },
  "click .js-play, click .vjs-control-bar .vjs-paused, touchstart .vjs-control-bar .vjs-paused, click .vjs-big-play-button, touchstart .vjs-big-play-button": function(e){

    let screenId = this._id;
    if(vPlayer.ended()){
        Meteor.call('time', screenId, 0);
    }

    Meteor.call("play", screenId,true);
  },

  "click .js-pause, click .vjs-control-bar .vjs-playing, touchstart .vjs-control-bar .vjs-playing":function(e){
    let screenId = this._id;
    Meteor.call("play", screenId,false);
  },
  "click .js-reload":function(e){
      vPlayer.load();
  }

});


Template.videoPlayer.onCreated(function(){

  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-85);
  });

});

Template.videoPlayer.onRendered(function(){
  $('.screen').css('height', $(window).height()-85);

  vPlayer = videojs('video', { preload:'auto'}, function(){
      //Disable playing video when click on 'Play' on controlbar
      this.controlBar.playToggle.off('click', this.controlBar.playToggle.handleClick);
      this.bigPlayButton.off('click', this.bigPlayButton.handleClick);
      this.bigPlayButton.off('tap', this.bigPlayButton.handleClick);

  });
});

Template.videoPlayer.onDestroyed(function(){

  const v = videojs('video');
  v.dispose();

});
