Meteor.publish("screen", function(){
  return Screen.find();
});

Meteor.publish("videos", function(screenId){
  if(screenId){
    var vids = Videos.find({belongToScreen:screenId});
    if(vids){
      return vids;
    }
  }
  return [];
});
