
Meteor.startup(function(){

  // $(window).bind('beforeunload', function(e) {
  //     e.preventDefault();
  //     console.log(Template.currentData());
  // //    Meteor.call("decViewer", Template.currentData()._id);
  // //    alert("TEST: " + Template.currentData()._id);
  // //     closingWindow();
  //      // have to return null, unless you want a chrome popup alert
  //      return null;
  //
  //      //return 'Are you sure you want to leave your Vonvo?';
  //  });
   orion.links.add({index:2,identifier:"test",title:"test"});
});

Router.configure({
    layoutTemplate: 'Layout'
});

Router.route('/:_id',function(){
  this.render('bigscreen',{
    to:'main',
    data:function(){
        return Screen.findOne({_id:this.params._id});
    }
  });
});

Router.route('/',function(){
  this.render('auditoriums',{
    to:'main'
  });
});
