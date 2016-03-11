
Meteor.subscribe("videos");
Meteor.subscribe("screen");

Template.bigscreen.helpers({
  "greeting": function(screenId){
    var greet = screenId;
    if(Meteor.userId()){
      greet += " , " + Meteor.userId();
    }

    return greet;
  },
  'viewers': function(){
      Meteor.subscribe('getViewers', this._id);
      return Meteor.users.find({"status.online":true});
  },
  'isCurrentUser' : function(){

    if(this._id == Meteor.userId()){
      return true;
    }
    return false;
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

  this.autorun(function(){
    if(Meteor.userId()){
      if(Template.currentData()){
        Meteor.call("thisUserIsIn", Meteor.userId(), Template.currentData()._id);
      }
    }
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
Template.bigscreen.onDestroyed(function(){
  if(Meteor.userId()){
    Meteor.call("thisUserIsNotIn", Meteor.userId(), this.data._id);

  }
});
