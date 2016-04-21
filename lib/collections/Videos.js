
export const Videos = new FS.Collection("videos", {
  stores: [
    new FS.Store.FileSystem("videos")
  ] ,
  filter: {
    allow: {
      contentTypes: ['video/*','audio/*'] //allow only videos/audios in this FS.Collection
    }
  }
});


//Images = new FS.Collection("images", {stores: [new FS.Store.FileSystem("images")]});
