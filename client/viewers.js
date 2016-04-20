import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.viewers.helpers({

  'viewers': function(){
      Meteor.subscribe('getViewers', this._id);
      var viewerList = Meteor.users.find({"status.online":true}, {sort:{username:1}});
      var viewersData = {
        viewerCount : viewerList.fetch().length,
        viewerList : viewerList
      };
      return viewersData;
  },
  'userIsLoading' :function(){
      //Meteor.subscribe('getViewers', this._id);
      var u = Meteor.users.findOne({_id:this._id});

      return u.isLoading;
  },

});

Template.viewerLabel.helpers({
  'isCurrentUser' : function(){

    if(this._id == Meteor.userId()){
      return true;
    }
    return false;
  }

});
