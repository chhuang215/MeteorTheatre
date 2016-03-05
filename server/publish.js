Meteor.publish("screen", function(){
  return Screen.find();
});

Meteor.publish("videos", function(){
  return Videos.find();
});
