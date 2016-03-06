
//This code is for everyone. Could go in common.js
Screen = new Mongo.Collection("screen");
Videos = new FS.Collection("videos", {
  stores: [
    new FS.Store.FileSystem("videos")
  ] ,
  filter: {
    allow: {
      contentTypes: ['video/*'] //allow only images in this FS.Collection
    }
  }
});
//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
