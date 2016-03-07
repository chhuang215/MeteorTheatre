
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
  "getCurrentVid": function () {

    // Session.get('playing');
    // Session.get('time');
    var vidScreen = Screen.findOne();
    if (vidScreen) {

      var currentVid = Videos.findOne({_id:vidScreen.currentlyPlaying});
      var time = vidScreen.time;
      myvideo = $("#video")[0];
      if(myvideo){
        if(myvideo.currentTime+3.5 < time || myvideo.currentTime-3.5 >time ){
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

    return {};
  }

});

Template.bigscreen.events({
  "timeupdate #video":function(){
    var vidScreen = Screen.findOne();
    var myvid = $('#video')[0];
    if(!myvid.seeking && vidScreen && vidScreen.playing){

      var time = myvid.currentTime;

      Session.set('time', time);

      Meteor.call('time', time);
    }

  },
  // "seeking #video":function(){
  //   var vidScreen = Screen.findOne();
  //   if(vidScreen){
  //     Session.set('playing', 0);
  //     Meteor.call("play", false);
  //   }
  //
  // },
  "seeked #video":function(){
    var vidScreen = Screen.findOne();
    if(vidScreen){
      var time = $('#video')[0].currentTime;
      Session.set('time', time);
      Meteor.call('time', time);
    }

  },
  "click .js-play": function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "play #video":  function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "click .js-pause":function(){
    Session.set('playing', 0);

    Meteor.call("play", false);
  },
  "pause #video":function(){
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

  // var vid = Screen.findOne();
  //
  // if(vid){
  //   //$('#video').attr("src", "videos/01.mp4");
  //   Session.set("play", vid.playing);
  //   Session.set("time", vid.time);
  //   //$('#video')[0].currentTime = vid.time;
  // }

  $('.screen').css('height', $(window).height()-80);
});
