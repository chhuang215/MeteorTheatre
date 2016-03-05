Meteor.subscribe("videos");
Meteor.startup(function(){
  $(window).bind('beforeunload', function() {

      Meteor.call("decViewer");
       closingWindow();
       // have to return null, unless you want a chrome popup alert
       return null;

       //return 'Are you sure you want to leave your Vonvo?';
   });
});



Router.configure({
    layoutTemplate: 'Layout'
});

Router.route('/',function(){
  this.render('bigscreen',{
    to:'main'
  });
});

// Router.route('/admin',function(){
//   this.render('admin',{
//     to:'main'
//   });
// });


Template.bigscreen.helpers({

  "viewers": function(){
    Meteor.subscribe("screen");
    var vid = Screen.findOne();
    if(vid){
      return vid.viewerCount;
    }
    return -1;
  },

  "vid": function () {
    Meteor.subscribe("screen");
    Session.get('playing');
    var t = Template.instance();
    if (t.view.isRendered) {
      var vid = Screen.findOne();

      if(vid){
        var time = vid.time;
        myvideo = $("#video");

        if(myvideo[0].currentTime+4 < time || myvideo[0].currentTime-4 >time ){
            myvideo[0].currentTime = time;
        }

        if(vid.playing == true){
          myvideo[0].play();

        }else{
          myvideo[0].pause();
        }
      }
    }
  }

});


Template.bigscreen.events({

  "submit .js-add-vid":function(e){
    event.preventDefault();
    var files = e.target.vid.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Videos.insert(files[0], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      })
    }
  },
  "timeupdate video":function(){

    var time = $('#video')[0].currentTime;

    Session.set('time', time);

    Meteor.call('time', time);
  },
  "click .js-play": function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "play video":  function(){
    Session.set('playing', 1);

    Meteor.call("play", true);
  },
  "click .js-pause":function(){
    Session.set('playing', 0);

    Meteor.call("play", false);
  },
  "pause video":function(){
    Session.set('playing', 0);

    Meteor.call("play", false);
  },
  "click .js-sync":function(e){

  }
});

Template.bigscreen.onCreated(function(){
  $(window).resize(function() {
    $('.screen').css('height', $(window).height()-80);
  });
  Meteor.call('incViewer');
});

Template.bigscreen.onRendered(function() {
  Meteor.subscribe("screen");

  var vid = Screen.findOne();
  $('#video').attr("src", "videos/01.mp4");
  //$('#video > source').attr("type", "video/mp4");
  if(vid){

    Session.set("play", vid.playing);
    Session.set("time", vid.time);
    $('#video')[0].currentTime = vid.time;
  }

  $('.screen').css('height', $(window).height()-80);
});
