
Meteor.subscribe("videos");
Meteor.subscribe("screen");
Template.bigscreen.helpers({

  "viewers": function(){

    var vid = Screen.findOne();
    if(vid){
      return vid.viewerCount;
    }
    return -1;
  },

  "vidSrc":function(){

    var s = Screen.findOne();
    if(s){
        var vid = Videos.findOne({_id:s.currentlyPlaying});
        if(vid){
          return vid.url();
        }
    }
    return "";
  },
  "vid": function () {

    Session.get('playing');
    Session.get('time');
    var t = Template.instance();
    var vidScreen = Screen.findOne();
    if (t.view.isRendered) {

      if(vidScreen){
        var time = vidScreen.time;
        myvideo = $("#video")[0];
        if(myvideo){
          if(myvideo.currentTime+4 < time || myvideo.currentTime-4 >time ){
              myvideo.currentTime = time;
          }

          if(vidScreen.playing == true){
            myvideo.play();
          }
          else{
            myvideo.pause();
          }
        } // End if
      } // End if
    } // End if
  }

});

Template.bigscreen.events({
  "timeupdate video":function(){

    var time = $('#video')[0].currentTime;

    Session.set('time', time);

    Meteor.call('time', time);
  },
  "click .js-play": function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "play video":  function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "click .js-pause":function(){
    Session.set('playing', 0);

    Meteor.call("play", false);
  },
  "pause video":function(){
    Session.set('playing', 0);

    Meteor.call("play", false);
  },
  "click .js-sync":function(e){

  }
});

Template.bigscreen.onCreated(function(){
  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-80);
  });
  Meteor.call('incViewer');
});

Template.bigscreen.onRendered(function() {

  var vid = Screen.findOne();

  if(vid){
    //$('#video').attr("src", "videos/01.mp4");
    Session.set("play", vid.playing);
    Session.set("time", vid.time);
    //$('#video')[0].currentTime = vid.time;
  }

  $('.screen').css('height', $(window).height()-80);
});
