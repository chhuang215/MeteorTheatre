Meteor.subscribe("screen");

Template.auditoriums.helpers({
  'getScreens': function(){
    var screens = Screen.find();
    if(screens){
      return screens;
    }
  }
});
