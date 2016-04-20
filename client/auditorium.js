import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

var screenId= "";

Template.auditorium.onCreated(function(){

  if(!Meteor.userId()){
      Meteor.loginVisitor();
  }

  this.autorun(function(){
    if(Meteor.userId()){
      if(Template.currentData()){
        screenId = Template.currentData()._id;
        Meteor.call("addViewerToScreen", Meteor.userId(), screenId);
      }
    }
  });
});


Template.auditorium.onDestroyed(function(){

  if(Meteor.userId()){
    Meteor.call("removeViewerFromScreen", Meteor.userId(), screenId);

  }
});
