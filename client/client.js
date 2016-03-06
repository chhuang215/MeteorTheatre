
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
