import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen, Videos, OnlineVideos} from '../lib/common.js';

Meteor.subscribe("videos");
Meteor.subscribe("screen");

var screenId= "";
Template.auditorium.helpers({

  'viewers': function(){
      Meteor.subscribe('getViewers', this._id);
      var viewerList = Meteor.users.find({"status.online":true}, {sort:{username:1}});
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
  }

});


Template.auditorium.onCreated(function(){

  if(!Meteor.userId()){
      Meteor.loginVisitor();
  }

$('.screen').css('height', $(window).height()-80);
  this.autorun(function(){
    if(Meteor.userId()){
      if(Template.currentData()){
        screenId = Template.currentData()._id;
        Meteor.call("thisUserIsIn", Meteor.userId(), Template.currentData()._id);
      }
    }
  });
});


Template.auditorium.onDestroyed(function(){

  if(Meteor.userId()){
    Meteor.call("thisUserIsNotIn", Meteor.userId(), screenId);

  }
});
