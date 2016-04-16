
Template.cabinet.helpers({
  "getVids": function(){
    Meteor.subscribe("videos", this.screenId);
    var vids = Videos.find();
    if(vids){
      return vids;
    }
  },
  "getOnlineVids":function(){
      Meteor.subscribe("onlinevideos", this.screenId);
      var vids = OnlineVideos.find();
      if(vids){
        return vids;
      }
  }
});

Template.cabinet.events({
  "change .js-add-vid":function(e){
    var files = e.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      var f = new FS.File(files[0]);
      f.belongToScreen = this.screenId;
      Videos.insert(f, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          alert("Not a video file.");
        }
      })
    }
  },
  "click .js-load-vid":function(e){
    Meteor.call('time', 0);
    Meteor.call('play', false);
    // Session.set('time', 0);
    // Session.set('playing', 0);
    Meteor.call('vidToPlay', this._id);
  },
  "click .js-remove-vid":function(){
    Meteor.subscribe("videos", this.screenId);
    Meteor.subscribe("screen");
    var v = Videos.findOne({_id:this._id});
    var s = Screen.findOne({_id:v.belongToScreen});
    if(v){
        var c = confirm('are you sure you want to delete?');
        if(c === true){

          v.remove();
          if(s.currentlyPlaying == v._id){
            Meteor.call('clearVidToPlay', s._id);
            Meteor.call('time', s._id,0);
            Meteor.call('play',s._id, false);
          }
        }
    }

  },
  "click .js-remove-onlinevid":function(){
    Meteor.subscribe("videos", this.screenId);
    Meteor.subscribe("screen");
    var v = OnlineVideos.findOne({_id:this._id});
    var s = Screen.findOne({_id:v.belongToScreen});
    if(v){
        var c = confirm('are you sure you want to delete?');
        if(c === true){

          Meteor.call("removeOnlineVideo", v._id);

          if(s.currentlyPlaying == v._id){

            Meteor.call('clearVidToPlay', s._id);
            Meteor.call('time', s._id, 0);
            Meteor.call('play', s._id, false);
          }
        }
    }

  },


  "submit .js-add-onlinevid":function(e){
    e.preventDefault();
    var url = e.target.videourl.value;

    var f = new FS.File();
    f.attachData(url, function (error) {
      if (error) {
        console.log(error);
        console.log('can\'t get file data');
        return;
      }
      console.log(f);


      e.target.videourl.value = "";


    });

      Meteor.call('addOnlineVideo', this.screenId, url);
        $('#modalUrlForm').modal("toggle");
  }

});
