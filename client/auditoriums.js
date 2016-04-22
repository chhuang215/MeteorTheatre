import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {Screen} from '/lib/collections/Screen.js';


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
  "click .js-delete-aud":function(e){

    Meteor.call("removeScreen", this._id, function(err, res){
        if(err){
          console.log(err);
        }else{

        }

    });
    e.currentTarget.disabled = true;
    e.currentTarget.value = "Deleting...";
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

Template.auditoriums.onCreated(function(){
  this.subscribe("screen");
});
