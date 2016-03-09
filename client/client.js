
Meteor.startup(function(){
  $(window).bind('beforeunload', function() {

      Meteor.call("decViewer", Template.currentData()._id);
       closingWindow();
       // have to return null, unless you want a chrome popup alert
       return null;

       //return 'Are you sure you want to leave your Vonvo?';
   });
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

// Router.route('/admin',function(){
//   this.render('admin',{
//     to:'main'
//   });
// });
