import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Videos} from './Videos';
import {OnlineVideos} from './OnlineVideos';

export const Screen = new Mongo.Collection("screen");

Meteor.methods({
  // Screen Methods
  'play':function(screenId,setPlay){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      Screen.update({ _id: vid._id }, {$set: {playing:setPlay}});
    }
  },
  'time':function(screenId, t){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      let timeDiff = t - vid.time;
      if(timeDiff > 1.3 || timeDiff < -1.3){
        Screen.update({ _id: vid._id }, {$set: {time:t}});
      }
    }
  },
  'isPlaying':function(screenId){
    const s = Screen.findOne({_id:screenId});
    if(s){
      return s.playing;
    }
  },
  'vidToPlay':function(vidId){
    var vid = Videos.findOne({_id:vidId}) || OnlineVideos.findOne({_id:vidId});
    if(vid){
      var screen = Screen.findOne({_id:vid.belongToScreen});
      if(screen){
        Screen.update({_id: screen._id}, {$set:{currentlyPlaying:vidId}});
      }
    }
  },
  'clearVidToPlay':function(screenId){
    var screen = Screen.findOne({_id:screenId});
    if(screen){
      Screen.update({_id: screen._id}, {$set:{currentlyPlaying:null}});
    }
  },
  'addNewScreen':function(ownerId){
    Screen.insert({
      title:"Private",
      playing:false,
      time:0,
      currentlyPlaying:null,
      isPublic:false,
      owner:ownerId,
      createdOn: new Date()
    }
    );
  },
  "removeScreen":function(screenId){
    const s = Screen.findOne({_id:screenId});
    if(s){
      let vids = Videos.find({belongToScreen:screenId}).fetch();
      let oVids = OnlineVideos.find({belongToScreen:screenId}).fetch();
      for (let v of vids){
        v.remove();
      }
      for (let v of oVids){
        Meteor.call('removeOnlineVideo', v._id);
      }
    }
   Screen.remove({_id:screenId});
  },
  "updateTitle":function(screenId,title){

    Screen.update({_id:screenId}, {$set: {title:title}});
  },
  "userNeedsToLoad":function(screenId, isLoading){
    var u =  Meteor.users.findOne({_id:this.userId});
    if(u){
      let inAudStat = u.inAuditorium.find(audStat => audStat.screenId == screenId);
      if(inAudStat){
          inAudStat.isLoading = isLoading;
      }
      Meteor.users.update({_id:u._id}, {$set: {inAuditorium:u.inAuditorium}});
    }

  },
  'userVideoIsPlaying':function(screenId, isPlaying){
    var u =  Meteor.users.findOne({_id:this.userId});
    if(u){
      let inAudStat = u.inAuditorium.find(audStat => audStat.screenId == screenId);
      if(inAudStat){
          inAudStat.isPlaying = isPlaying;
      }
      Meteor.users.update({_id:u._id}, {$set: {inAuditorium:u.inAuditorium}});
    }
  },
  'addViewerToScreen':function(userId,screenId){
    if(this.userId == userId){
        const u =  Meteor.users.findOne({_id:userId});
        if(!u) return;
        const inAudstat =
        {
          screenId:screenId,
          isPlaying:false,
          isLoading:false,
          joinedOn: new Date()

        };
        const uAudList = u.inAuditorium;

        if(uAudList){

          const index = uAudList.map(function(aud){return aud.screenId}).indexOf(screenId);

          if(index == -1){

            uAudList.push(inAudstat);

            Meteor.users.update({_id:userId}, {$set: {inAuditorium:uAudList}});
          }
        }
        else{

          Meteor.users.update({_id:userId}, {$set: {inAuditorium:[inAudstat]}});
        }
    }

  },

  'removeViewerFromScreen':function(userId,screenId){
    if(this.userId == userId){
      var u =  Meteor.users.findOne({_id:userId, inAuditorium:{$elemMatch: {screenId:screenId}}});
      if(u){
        let uAudList = u.inAuditorium;
        if(uAudList){
          const index = uAudList.map(function(aud){return aud.screenId}).indexOf(screenId);
          if(index != -1){
            uAudList.splice(index,1);
          }
        }
        else{
          uAudList= [];
        }
        Meteor.users.update({_id:userId}, {$set: {inAuditorium:uAudList}});
      }
    }
  }

});

//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
