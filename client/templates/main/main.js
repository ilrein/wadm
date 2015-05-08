Template.main.onCreated(function(){
  this.subscribe('decisions', function(userId){});
});

Template.main.helpers({
  'totalDecisions': function() {
    return Decisions.find({}).count();
  },
  'totalDecisionsText': function() {
    if (Decisions.find({}).count() > 1) {
      return "Decision Matrices Formed"
    } else {
      return "Decision Matrix Formed"
    }
  },

  "decision": function() {
    return Decisions.find({}, { sort: { createdOn: -1 } });
  }
});

Template.main.events({
  'click [data-new-decision]': function() {
    $('.grid').velocity("transition.swoopOut", function(){
      Router.go('/new');
    });
  },
  'click [data-show-decision]': function( e, tpl ) {
    var self = this;
    $('.grid').velocity("transition.swoopOut", function(){
      Router.go('/show/' + self._id);
    });
  }
})