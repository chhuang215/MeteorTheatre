
Meteor.startup(function(){

   orion.links.add({index:2,identifier:"test",title:"test"});
   AccountsGuest.forced = false;
   Meteor.call("enableGuestLogin");

});

Router.configure({
    layoutTemplate: 'Layout'
});

Router.route('/:_id',function(){
  this.render('bigscreen',{
    to:'main',
    data:function(){
        return  Screen.findOne({_id:this.params._id});
    }
  });
});

Router.route('/',function(){
  this.render('auditoriums',{
    to:'main'
  });
});
