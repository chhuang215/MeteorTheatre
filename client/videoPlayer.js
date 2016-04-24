import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import {Screen} from '/lib/collections/Screen.js';
import {Videos} from '/lib/collections/Videos.js';
import {OnlineVideos} from '/lib/collections/OnlineVideos.js';

import videojs from 'video.js';

const TIME_OFF_THRESHOLD = 3.6;
var vPlayer = null;

Template.videoPlayer.helpers({

  loadCurrentVid(){
    const vidScreen = Screen.findOne({_id:this._id});
    if (!vidScreen) return;

    let tmpl = Template.instance();
    if(!tmpl.view.isRendered || !vPlayer) return;

    const currentVid = Videos.findOne({_id:vidScreen.currentlyPlaying}) || OnlineVideos.findOne({_id:vidScreen.currentlyPlaying});
    if(!currentVid) {
      $(".vjs-big-play-button").hide();
      vPlayer.controls(false);
      vPlayer.reset();
      return;
    }

    try{
      var url = currentVid.url();
    }catch(err){
      url = currentVid.url;
    }

    let time = vidScreen.time;

    if(!url){
      $(".vjs-big-play-button").hide();
      vPlayer.controls(false);
      vPlayer.reset();
      return;
    }
    else if(vPlayer.currentSrc() != url){
      vPlayer.reset();
      vPlayer.src(url);
    }

    if (!vPlayer.controls()){
      vPlayer.controls(true);
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


  },
 });

Template.videoPlayer.events({
  "timeupdate video":function(){
    if(vPlayer.seeking()) return;
    const screenId = this._id;
    let time = vPlayer.currentTime();

    Meteor.call("isPlaying", screenId, function(error, playing){
      if(error){ console.log("error", error);}
      if(playing){
        Meteor.call('time', screenId, time);
        return;
      }
      vPlayer.pause();
      $(".vjs-big-play-button").show();

    });
  //  const vidScreen = Screen.findOne({_id:screenId});
  //
  //   if(vidScreen && !vPlayer.seeking()){
  //
  //     if(!vidScreen.playing){
  //
  //       vPlayer.pause();
  //       $(".vjs-big-play-button").show();
  //       return;
  //     }
  //
  //     Meteor.call('time', screenId, time);
  //
  //
  //   }
  //
  },
  "seeked video":function(){
    const screenId = this._id;
    const vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen && !vidScreen.playing){
      Meteor.call('time', screenId, vPlayer.currentTime());
    }

  },
  'loadstart video, waiting video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", this._id, true);
    }
    $('.vjs-loading-spinner').show();
  },
  'canplay video':function(){
    $('.vjs-loading-spinner').hide();
  },
  'canplaythrough video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", this._id, false);
    }
  },
  "click .js-play, click .vjs-control-bar .vjs-paused, touchstart .vjs-control-bar .vjs-paused, click .vjs-big-play-button, touchstart .vjs-big-play-button": function(e){

    const screenId = this._id;
    if(vPlayer.ended()){
        Meteor.call('time', screenId, 0);
    }

    Meteor.call("play", screenId,true);
  },

  "click .js-pause, click .vjs-control-bar .vjs-playing, touchstart .vjs-control-bar .vjs-playing":function(e){

    Meteor.call("play", this._id,false);
  },
  "click .js-reload":function(e){
      vPlayer.load();
  },
  "play video":function(e){
    Meteor.call("userVideoIsPlaying", this._id, true);
  },
  "pause video":function(e){
    Meteor.call("userVideoIsPlaying", this._id, false);
  }

});


Template.videoPlayer.onCreated(function(){

  $(window).resize(function() {
    let winHeight = $(window).height();
    let vidHeight = $('video').height();
  //  if(winHeight > vidHeight)
    //  $('.screen').css('max-height', $(window).height()-85);
  });

});

Template.videoPlayer.onRendered(function(){
//  $('.screen').css('max-height', $(window).height()-85);

  vPlayer = videojs('video', { preload:'auto'}, function(){
      //Disable playing video when click on 'Play' on controlbar
      this.controlBar.playToggle.off('click', this.controlBar.playToggle.handleClick);
      this.bigPlayButton.off('click', this.bigPlayButton.handleClick);
      this.bigPlayButton.off('tap', this.bigPlayButton.handleClick);

  });
});

Template.videoPlayer.onDestroyed(function(){
  if(vPlayer){
    vPlayer.dispose();
  }
});
