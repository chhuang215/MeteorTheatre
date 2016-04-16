//
// Router.configure({
//     layoutTemplate: 'Layout'
// });
//
// Router.route('/:_id',function(){
//   this.render('bigscreen',{
//     to:'main',
//     data:function(){
//         return  Screen.findOne({_id:this.params._id});
//     }
//   });
// });
//
// Router.route('/',function(){
//   this.render('auditoriums',{
//     to:'main'
//   });
// });

FlowRouter.route('/', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "auditoriums"});
    }
});

FlowRouter.route('/:_id', {
    action: function(params) {
        var s = Screen.findOne({_id:params._id});
        console.log(s);
        BlazeLayout.render("layout", {main: "bigscreen", data: s});
    }
});
