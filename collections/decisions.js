Decisions = new Mongo.Collection("decisions");

// var Schemas = {};

// Schemas.Decision = new SimpleSchema({
//     title: {
//         type: String,
//         label: "Title",
//         max: 200
//     },
//     author: {
//         type: String,
//         label: "Author"
//     }
// });

// Decisions.attachSchema(Schemas.Decision);

Decisions.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  },
  fetch: ['owner']
})