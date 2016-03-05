
//This code is for everyone. Could go in common.js
Screen = new Mongo.Collection("screen");
Videos = new FS.Collection("videos", {stores: [new FS.Store.FileSystem("videos")]});
//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
