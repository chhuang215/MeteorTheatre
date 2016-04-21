import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen} from '../lib/collections/Screen';

var screenId= "";

Template.auditorium.helpers({
  getScreen(){
    let sid = Session.get('sid');
    var s = Screen.findOne({_id:sid}) || {};

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
      console.log( FlowRouter.getParam('_id'));
      screenId = FlowRouter.getParam('_id');
      Session.set('sid',screenId);

      self.subscribe("screen",screenId);
      self.subscribe("videos", screenId);
      self.subscribe("onlinevideos", screenId);
      self.subscribe('getViewers', screenId);
      Meteor.call("addViewerToScreen", Meteor.userId(), screenId);

    }
  });
});


Template.auditorium.onDestroyed(function(){

  if(Meteor.userId()){

    Meteor.call("removeViewerFromScreen", Meteor.userId(), Session.get('sid'));
    Session.set('sid', null)

  }
});
