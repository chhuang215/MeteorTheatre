Meteor.methods({
  "incViewer":function(screenId){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      Screen.update({ _id: vid._id }, {$set: {viewerCount:vid.viewerCount+1}});
    }
  },
  "decViewer":function(screenId){
    var vid = Screen.findOne({_id:screenId});
    if(vid){
      Screen.update({ _id: vid._id }, {$set: {viewerCount:vid.viewerCount-1}});
    }
  },
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
    var vid = Videos.findOne({_id:vidId});
    if(vid){
      var screen = Screen.findOne({_id:vid.belongToScreen});
      if(screen){
        Screen.update({_id: screen._id}, {$set:{currentlyPlaying:vidId}});
      }
    }
  },
  'addNewScreen':function(ownerId=null){
    Screen.insert({
      name:"Private",
      playing:false,
      volume:50,
      time:0,
      viewerCount:0,
      currentlyPlaying:null,
      isPublic:false,
      owner:ownerId}
    );
  },
  "removeScreen":function(screenId){

    Screen.remove({_id:screenId});
  }

});
