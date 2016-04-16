
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
  "submit .js-add-onlinevid":function(e){
    e.preventDefault();
    var url = e.target.videourl.value;
    var screenId = this.screenId;
    var name = null, type = null;
    var f = new FS.File();
    f.attachData(url, function (error) {
      if (error) {
        console.log(error);
        console.log('can\'t get file data');

      }else{
        name = f.original.name;
        type = f.original.type;
        console.log(name + " " + type);

      }
      console.log(f);


      e.target.videourl.value = "";

      Meteor.call('addOnlineVideo', screenId, url,name,type);
    });


        $('#modalUrlForm').modal("toggle");
  }

});
