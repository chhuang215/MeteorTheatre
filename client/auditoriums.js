Meteor.subscribe("screen");

Template.auditoriums.helpers({
  'getScreens': function(){
    var screens = Screen.find();
    if(screens){
      return screens;
    }
  }
});

Template.auditoriums.events({
  "click .js-create-aud": function(){
    Meteor.call("addNewScreen");
  },
  "click .js-delete-aud":function(){
    Meteor.call("removeScreen", this._id);
  }
});
