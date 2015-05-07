Template.main.onCreated(function(){
  this.subscribe('decisions', function(userId){});
});

Template.main.helpers({
  'totalDecisions': function() {
    return Decisions.find({}).count();
  },
  "decision": function() {
    return Decisions.find({});
  }
});

Template.main.events({
  'click [data-new-decision]': function() {
    $('.grid').velocity("transition.swoopOut", function(){
      Router.go('/new');
    });
  }
})