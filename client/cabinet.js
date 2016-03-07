Meteor.subscribe("videos");

Template.cabinet.helpers({
  "getVids": function(){
    var vids = Videos.find();
    if(vids){
      return vids;
    }
  },
});

Template.cabinet.events({
  "change .js-add-vid":function(e){
    var files = e.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Videos.insert(files[0], function (err, fileObj) {
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
    var v = Videos.findOne({_id:this._id});
    if(v){
        var c = confirm('are you sure you want to delete?');
        if(c === true){
          v.remove();
          // Videos.remove({_id:v._id}, function(err,result){
          //   if (err){
          //     console.log(err);
          //   }else{
          //     Meteor.call('time', 0);
          //     Meteor.call('play', false);
          //     Session.set('time', 0);
          //     Session.set('playing', 0);
          //     //console.log(result);
          //   }
          // });
        }
    }

  },

});
