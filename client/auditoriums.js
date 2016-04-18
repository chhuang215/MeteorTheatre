import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen} from '../lib/common.js';
Meteor.subscribe("screen");

Template.auditoriums.helpers({
  'getScreens': function(){
    var screens = Screen.find();
    if(screens){
      return screens;
    }
  }
});

Template.auditoriums.events({
  "click .js-create-aud": function(){
    Meteor.call("addNewScreen");
  },
  "click .js-delete-aud":function(){
    Meteor.call("removeScreen", this._id);
  },
  'click .js-enter-aud':function(){
    if(!Meteor.userId()){

        //AccountsGuest.enabled = true;
        Meteor.loginVisitor();
    }
  },

  'submit .js-change-aud-title':function(e){
      e.preventDefault();
      var title = e.target.audtitle.value.trim();
      e.target.audtitle.value="";
      if(title){
        var s = Screen.findOne({_id:this._id});
        if(s){
          Meteor.call("updateTitle", s._id, title);
        }
      }
      $('#modalChangeTitle'+this._id).modal('hide');
  }
});
