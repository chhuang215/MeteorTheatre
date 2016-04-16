
Template.cabinetItem.helpers({
  "isUploaded":function(uploaded){
    if(uploaded == false){
      return false;
    }
    return true;
  }
});

Template.cabinetItem.events({

  "click .js-load-vid":function(e){
    Meteor.call('time', this.belongToScreen, 0);
    Meteor.call('play',this.belongToScreen, false);
    Meteor.call('vidToPlay', this._id);
  },
  "click .js-remove-vid":function(){
    Meteor.subscribe("videos", this.belongToScreen);
    Meteor.subscribe("onlinevideos", this.belongToScreen);
    Meteor.subscribe("screen");
    var v = Videos.findOne({_id:this._id});
    var ov = OnlineVideos.findOne({_id:this._id});
    var s = Screen.findOne({_id:this.belongToScreen});
    if(v || ov){
      var vidId;
        var c = confirm('are you sure you want to delete?');
        if(c === true){
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
        }
    }

  },
  // "click .js-remove-onlinevid":function(){
  //
  //   Meteor.subscribe("onlinevideos", this.belongToScreen);
  //   Meteor.subscribe("screen");
  //   var
  //   console.log(v + " " +this._id);
  //   var s = Screen.findOne({_id:this.belongToScreen});
  //   if(v){
  //       var c = confirm('are you sure you want to delete?');
  //       if(c === true){
  //
  //         Meteor.call("removeOnlineVideo", v._id);
  //
  //         if(s.currentlyPlaying == v._id){
  //
  //           Meteor.call('clearVidToPlay', s._id);
  //           Meteor.call('time', s._id, 0);
  //           Meteor.call('play', s._id, false);
  //         }
  //       }
  //   }
  //
  // }
});
