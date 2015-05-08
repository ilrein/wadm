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
  'theBetterOption': function() {
    var data = Blaze.getData(),
        firstOptionPoints = [],
        firstTotal = 0,
        secondOptionPoints = [],
        secondTotal = 0;

    $.each( data.factors, function( index, item ){
      var weight    = item.weight,
          optionOne = item.firstOptionScore,
          optionTwo = item.secondOptionScore;

      optionOne = optionOne * weight;
      firstOptionPoints.push(optionOne);

      optionTwo = optionTwo * weight;
      secondOptionPoints.push(optionTwo);
    });

    $.each( firstOptionPoints, function(){
      firstTotal += this;
    });

    $.each( secondOptionPoints, function(){
      secondTotal += this;
    });

    if ( firstTotal > secondTotal ) {
      return {
        result: true,
        winner: data.firstOption,
        loser: data.secondOption 
      } 
    } else if ( firstTotal < secondTotal ) {
      return {
        result: true,
        winner: data.secondOption,
        loser: data.firstOption
      } 
    } else {
      return {
        result: false,
        tie: "Both options score equally" 
      } 
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