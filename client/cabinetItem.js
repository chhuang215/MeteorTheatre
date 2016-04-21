import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import {Screen, Videos, OnlineVideos} from '../lib/common.js';
import {Screen} from '../lib/collections/Screen.js';
import {Videos} from '../lib/collections/Videos.js';
import {OnlineVideos} from '../lib/collections/OnlineVideos.js';

//Meteor.subscribe("screen");

Template.cabinetItem.helpers({
  "isUploaded":function(uploaded){
    if(uploaded == false){
      return false;
    }
    return true;
  },
  isCurrentlyPlaying(){


    var s = Screen.findOne({_id:this.belongToScreen});

    if(s.currentlyPlaying == this._id){
    //  console.log('this vid is playing');
      return true;
    }
    //console.log('this vid is not playing');
    return false;
  },
  videoIsPlayingDisableButton(){
    var s = Screen.findOne({_id:this.belongToScreen});

    if(s.playing){
      return true;
    }
    return false;
  }

});

Template.cabinetItem.events({

  "click .js-load-vid":function(e){
    Meteor.call('time', this.belongToScreen, 0);
    Meteor.call('play',this.belongToScreen, false);
    Meteor.call('vidToPlay', this._id);
  },
  "click .js-remove-vid":function(e){



    var v = Videos.findOne({_id:this._id});
    var ov = OnlineVideos.findOne({_id:this._id});
    var s = Screen.findOne({_id:this.belongToScreen});
    if(v || ov){
        $('#panel'+this._id).hide('slow',function(){
          var vidId;

          if(v){
            v.remove();
            vidId = v._id;
          }
          else{
            vidId = ov._id;
            Meteor.call("removeOnlineVideo", vidId);
          }

          if(s.currentlyPlaying == vidId){
            Meteor.call('clearVidToPlay', s._id);
            Meteor.call('time', s._id,0);
            Meteor.call('play',s._id, false);
          }
        });
    }
      $('#confirmRemoveModal'+this._id).modal('toggle');
  },
  'click .js-confirm-remove':function(){
    $('#confirmRemoveModal'+this._id).modal('show');
  }
});

Template.cabinetItem.onCreated(function(){
  Meteor.subscribe("videos", this.belongToScreen);
  Meteor.subscribe("onlinevideos", this.belongToScreen);
});
