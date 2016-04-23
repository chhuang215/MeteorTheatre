import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen} from '/lib/collections/Screen';

var screenId = null;

Template.auditorium.helpers({
  getScreen(){
    Session.get('screen');
    var s = Screen.findOne({_id:screenId}) || {};
    return s;

  }
});

Template.auditorium.onCreated(function(){

  if(!Meteor.userId()){
      Meteor.loginVisitor();
  }
  var self = this;
  this.autorun(function(){
    if(Meteor.userId()){
      Session.set('screen', 1);
      screenId = FlowRouter.getParam('_id');

      self.subscribe("screen",screenId);
      self.subscribe("videos", screenId);
      self.subscribe("backendlessvideos", screenId);
      self.subscribe("onlinevideos", screenId);
      self.subscribe('getViewers', screenId);
      Meteor.call("addViewerToScreen", Meteor.userId(), screenId);

    }
  });
});

Template.auditorium.onDestroyed(function(){

  if(Meteor.userId()){
    Meteor.call("removeViewerFromScreen", Meteor.userId(), screenId);
  }
});
