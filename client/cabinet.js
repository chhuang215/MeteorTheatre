
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
    Session.set('time', 0);
    Session.set('playing', 0);
    Meteor.call('vidToPlay', this._id);
  },
  "click .js-remove-vid":function(){
    Meteor.subscribe("videos", this.screenId);
    var v = Videos.findOne({_id:this._id});
    var s = Screen.findOne();
    if(v){
        var c = confirm('are you sure you want to delete?');
        if(c === true){
          if(s.currentlyPlaying == v._id){
            Meteor.call('vidToPlay', "");
            Meteor.call('time', 0);
            Meteor.call('play', false);
            Session.set('time', 0);
            Session.set('playing', 0);
          }
          v.remove();
        }
    }

  },

  "submit .js-add-onlinevid":function(e){
    e.preventDefault();

    $('#modalUrlForm').modal("toggle");
  }

});
