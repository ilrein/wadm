Meteor.publish("decisions", function(userId){
  return Decisions.find({}, { fields: {originator: userId} })
})