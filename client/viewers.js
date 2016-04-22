import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.viewers.helpers({

  'viewers': function(){

      var viewerList = Meteor.users.find({"status.online":true}, {sort:{username:1}});
      var viewersData = {
        viewerCount : viewerList.fetch().length,
        viewerList : viewerList,
      };
      return viewersData;
  }
});

Template.viewerLabel.helpers({
  'viewer':function(){

    const sid = FlowRouter.getParam('_id');

    let viewerDisplay = {
        labelStyle:'label-primary',
        name: this.username,
    };

    if(this._id == Meteor.userId()){
      viewerDisplay.labelStyle = 'label-success';
      viewerDisplay.name = '[YOU] ' + viewerDisplay.name;
    }

    let inAudStat = this.inAuditorium.find(audStat => audStat.screenId == sid);
    viewerDisplay.isLoading = inAudStat.isLoading;
    viewerDisplay.isPlaying = inAudStat.isPlaying;


    return viewerDisplay;
  }
});

Template.viewerLabel.onRendered(function(){
  // this.screenId = FlowRouter.getParam('_id');
  // console.log(this.screenId);
});
