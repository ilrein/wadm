Meteor.publish("decisions", function(userId){
  return Decisions.find({}, { fields: {originator: userId} })
});

Meteor.publish("decision", function(decisionId){
  check(decisionId, String);
  return Decisions.find({_id: decisionId})
});