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
      Screen.update({ _id: vid._id }, {$set: {time:t}});
    }
  },
  'vidToPlay':function(vidId){

    var screen = Screen.findOne({_id:vid.belongToScreen});
    if(screen){
      Screen.update({_id: screen._id}, {$set:{currentlyPlaying:vidId}});
    }

  },
  'addNewScreen':function(ownerId=null){
    Screen.insert({
      name:"Private",
      playing:false,
      time:0,
      currentlyPlaying:null,
      isPublic:false,
      owner:ownerId}
    );
  },
  "removeScreen":function(screenId){

    Screen.remove({_id:screenId});
  },
  // End Screen Methods

  "addOnlineVideo":function(screenId, url){
    OnlineVideos.insert({
      url:url;
      belongToScreen:screenId;
    });
  },

  "removeOnlineVideo":function(id){
    OnlineVideos.remove({_id:id});
  },

  "enableGuestLogin":function(){
    AccountsGuest.enabled = true;
  },
  'thisUserIsIn':function(userId,screenId){
    if(this.userId == userId){
        var u =  Meteor.users.findOne({_id:userId});
        if(u.isIn){
          if(u.isIn.indexOf(screenId) == -1){

            u.isIn.push(screenId);

            Meteor.users.update({_id:userId}, {$set: {isIn:u.isIn}});
          }
        }
        else{
          Meteor.users.update({_id:userId}, {$set: {isIn:[screenId]}});
          //u.isIn = ;
        }

    }

  },

  'thisUserIsNotIn':function(userId,screenId){
    if(this.userId == userId){
      var u =  Meteor.users.findOne({_id:userId, isIn:screenId});
      if(u.isIn){
        var elem = u.isIn.indexOf(screenId);
        if(elem != -1){
          u.isIn.splice(elem,1);
        }
      }
      else{
        u.isIn = [];
      }
      Meteor.users.update({_id:userId}, {$set: {isIn:[]}});
    }
  }

});
