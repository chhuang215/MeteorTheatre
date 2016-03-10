
Meteor.subscribe("videos");
Meteor.subscribe("screen");
Template.bigscreen.helpers({
  "greeting": function(screenId){
    if(screenId){
      Session.set('sid', screenId);
      Meteor.call('incViewer',screenId);
    }
    return screenId;
  },
  "viewers": function(){

    var vid = Screen.findOne({_id:this._id});
    if(vid){
      return vid.viewerCount;
    }
    return -1;
  },
  "getCurrentVid": function () {

    // Session.get('playing');
    // Session.get('time');
    var vidScreen = Screen.findOne({_id:this._id});
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
    var screenId = Template.currentData()._id;
    var vidScreen = Screen.findOne({_id:screenId});
    var myvid = $('#video')[0];
    if(!myvid.seeking && vidScreen && vidScreen.playing){

      var time = myvid.currentTime;

      Session.set('time', time);

      Meteor.call('time', screenId, time);
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
    var screenId = Template.currentData()._id;
    var vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen){
      var time = $('#video')[0].currentTime;
      Session.set('time', time);
      Meteor.call('time', screenId, time);
    }

  },
  "click .js-play": function(){
    Session.set('playing', 1);
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,true);
  },
  "play #video":  function(){
    Session.set('playing', 1);
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId, true);
  },
  "click .js-pause":function(){
    Session.set('playing', 0);
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  },
  "pause #video":function(){
    Session.set('playing', 0);
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  },
  "click .js-sync":function(e){

  }
});

Template.bigscreen.onCreated(function(){

  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-80);
  });
  $(window).bind('beforeunload', function(e) {
      e.preventDefault();
      closingWindow();
    });

});

Template.bigscreen.onRendered(function() {
    //console.log(this);


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

Template.bigscreen.onDestroyed(function () {
  Meteor.call('decViewer', Template.currentData()._id);
  $(window).unbind();
  Session.set('sid', "");
});
closingWindow = function(){
  Meteor.call('decViewer', Session.get('sid'));
}
