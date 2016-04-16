
Meteor.subscribe("videos");
Meteor.subscribe("screen");
var TIME_OFF_THRESHOLD = 3.5;
var screenId= "";
Template.bigscreen.helpers({

  'viewers': function(){
      Meteor.subscribe('getViewers', this._id);
      var viewerList = Meteor.users.find({"status.online":true});
      var viewersData = {
        viewerCount : viewerList.fetch().length,
        viewerList : viewerList
      };
      return viewersData;
  },
  'userIsLoading' :function(userId){
      Meteor.subscribe('getViewers', this._id);
      var u = Meteor.users.findOne({_id:userId});
      return u.isLoading;
  },
  'isCurrentUser' : function(){

    if(this._id == Meteor.userId()){
      return true;
    }
    return false;
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

Template.bigscreen.events({
  "timeupdate #video":function(){
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
  "seeked #video":function(){
    var screenId = Template.currentData()._id;
    var vidScreen = Screen.findOne({_id:screenId});
    if(vidScreen){
      var time = $('#video')[0].currentTime;

      Meteor.call('time', screenId, time);
    }

  },

  'canplaythrough #video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", false);
    }
  },
  'waiting #video':function(){
    if(Meteor.userId){
      Meteor.call("userNeedsToLoad", true);
    }
  },
  "click .js-play": function(){
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,true);
  },
  "play #video":  function(){
    event.preventDefault(event)

    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId, true);
  },
  "click .js-pause":function(){

    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  },
  "pause #video":function(event){
    event.preventDefault()
    var screenId = Template.currentData()._id;
    Meteor.call("play", screenId,false);
  }
});

Template.bigscreen.onCreated(function(){

  if(!Meteor.userId()){
      Meteor.loginVisitor();
  }

  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-80);
  });

  this.autorun(function(){
    if(Meteor.userId()){
      if(Template.currentData()){
        screenId = Template.currentData()._id;
        Meteor.call("thisUserIsIn", Meteor.userId(), Template.currentData()._id);
      }
    }
  });
});

Template.bigscreen.onRendered(function() {

  $('.screen').css('height', $(window).height()-80);
});

Template.bigscreen.onDestroyed(function(){

  if(Meteor.userId()){
    Meteor.call("thisUserIsNotIn", Meteor.userId(), screenId);

  }
});
