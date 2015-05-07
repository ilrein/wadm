Template.new.onRendered(function(){
  // on load, animate the page with swoopIn
  $('#transition').velocity("transition.swoopIn", function(){});
});

// use a counter to generate dynamic input fields and assign to name

var counter = 1;

Template.new.events({
  'click [data-add-factor]': function() {

    // visually change the remove factor button if there are no factor fields

    if ($('button[data-remove-factor]').hasClass('disabled')) {
      $('button[data-remove-factor]').removeClass('disabled');  
    }

    // append a new factor field with each click of +factor, and animate it in
    $('.ui.form')  
    .append('<div style="left: 500px; opacity: 0;" class="two factor fields ui segment"><div class="field"><label> Factor </label> <input type="text" name="factor' + counter + '"> </div> <div class="field"> <label> Weighting </label> <input type="text" name="weight' + counter + '"> </div> </div> ');      

    var odd = $('div.two.factor.fields').length;
    var target = $('div.two.factor.fields').last();

    if (odd % 2 == 0) {
      target.addClass('pink')
    } else {
      target.addClass('teal')
      target.css("left", "-500px");
    }

    $('div.two.factor.fields').last().velocity({ opacity: 1, left: "0px" }, { 
      duration: "slow",
      begin: function() {
        // let's scroll to the newly created element
        target.get(0).scrollIntoView({block: "end", behavior: "smooth"});
      }
    });

    // increment the counter everytime we add a field
    counter++;
  },
  'click [data-remove-factor]': function( e, tpl ){

    // look in the form for the last factor-field, animate it out, and remove it from the dom

    var form = $('.ui.form');  
    var last = form.children('div.two.factor.fields').last();
    last.velocity({ 
      opacity: 0 
    }, { 
      duration: "slow",  
      complete: function() {
        last.remove();    

        // reset the remove factor button if the last field has been removed

        if ( form.children('div.two.factor.fields').length == 0 ) {
          $('button[data-remove-factor]').addClass('disabled');  
        }

        // don't forget to adjust the counter for consistency
        counter--;
      }
    });
  },
  'click [data-submit-decision]': function( e, tpl ) {
    
    // loop through all the factors to generate an object
    
    var factors = $('div.two.factor.fields'),
        size = factors.length,
        decision = {};
        decision.owner = Meteor.userId();
        decision.title = $('input[name="title"]').val();
        decision.createdOn = moment().format("MMM Do YYYY");

        // do we need a field which tracks whether a decision was weighed?

        // decision.concluded = false;

    $.each(factors, function( index, item ){

      // make sure index starts at 1

      index++;
      var property = "factor" + index + "";

      // need the factor name + weighting rank

      var factorName = $(item).children().first().children('input').val();
      var weightingRank = $(item).children().eq(1).children('input').val();

      // dynamically add "factor[index]" for each fieldset

      decision[property] = [factorName, weightingRank];

    });

    Decisions.insert(decision, function( err, id ){
      if (!err) {
        Router.go("/");  
      }
      
      // TODO sexy vex alert confirming submission, or showing errors
      // then redirecting the user to actually making the decision
    });
  }
})
