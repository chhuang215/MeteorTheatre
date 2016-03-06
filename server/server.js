
//Films.remove({});
if (Screen.find().count() === 0) {
  Screen.insert({playing:false, volume:50, time:0,viewerCount:0, currentlyPlaying:null});
}

Videos.allow({
  'insert':function(){return true;},
  'remove':function(){return true;},
  'update':function(){return true;},
  'download':function(){
    return true;
  }
});
