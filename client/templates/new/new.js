Template.new.onRendered(function(){
  // on load, animate the page with swoopIn
  $('#transition').velocity("transition.swoopIn", function(){});
});

// use a counter to generate dynamic input fields and assign to name

var counter = 1;

Template.new.events({
  'click [data-add-factor]': function() {

    // lets validate that title/first/second option are all set
    var title = $('input[name="title"]').val(),
    firstoption = $('input[name="firstoption"]').val(),
    secondoption = $('input[name="secondoption"]').val();

    if (title && firstoption && secondoption) {
      executeEvents();
      clearFormErrors();
    } else {
      showFormErrors();
    };
  },
  'click [data-remove-factor]': function( e, tpl ){

    // look in the form for the last factor-field, animate it out, and remove it from the dom

    var form = $('.ui.form');  
    var last = form.children('.ui.segment').last();
    last.velocity({ 
      opacity: 0 
    }, { 
      duration: "slow",  
      complete: function() {
        last.remove();    

        // reset the remove factor button if the last field has been removed

        if ( form.children('.ui.segment').length == 0 ) {
          $('button[data-remove-factor]').addClass('disabled');  
        }

        // don't forget to adjust the counter for consistency
        counter--;
      }
    });
  },
  'click [data-submit-decision]': function( e, tpl ) {

    // loop through all the factors to generate an object
    
    var factors = $('.ui.segment'),
    size = factors.length,
    decision = { factors: {} };

    decision.owner = Meteor.userId();
    decision.title = $('input[name="title"]').val();
    decision.createdOn = moment().format("MMMM Do YYYY, h:mm:ss a");
    decision.firstOption = $('input[name="firstoption"]').val();
    decision.secondOption = $('input[name="secondoption"]').val();

    // do we need a field which tracks whether a decision was weighed?

    // decision.concluded = false;

    $.each(factors, function( index, item ){

      // make sure index starts at 1

      index++;
      
      // need the factor name + weighting rank

      var factorName = $(item).children().first().children().first().children('input').val();
      var weightingRank = $(item).children().eq(1).children().first().children('input').val();

      // the actual scores for both options

      var firstOptionScore = $(item).children().eq(1).children().first().children('input').val();
      var secondOptionScore = $(item).children().eq(1).children().eq(1).children('input').val();

      // format the data so I call #each on factors

      var sanity = String(index);

      decision.factors[sanity] = {
        title: factorName, 
        weight: weightingRank,
        firstOptionScore: firstOptionScore,
        secondOptionScore: secondOptionScore
      };

    });

    Decisions.insert(decision, function( err, id ){
      if (!err) {
        Router.go("/");  
      }
    });
  }
})

function showFormErrors() {
  var error = $('#formError');
  if (error.length == 0) {
    $('.twelve.wide.column').append('<div style="top: 500px" id="formError" class="ui red message">Please enter a Title, First Option & Second Option</div>');
    $('#formError').velocity({ top: 0 }, { duration: 600 });
  } else {
    error.transition('shake');
  }
}

function clearFormErrors() {
   // remove warning message if it exists
   var error = $('#formError');
   if (error) {
    error.remove();
  }
}

function executeEvents() {


    // visually change the remove factor button if there are no factor fields

    if ($('button[data-remove-factor]').hasClass('disabled')) {
      $('button[data-remove-factor]').removeClass('disabled');  
    }

    // append a new factor field with each click of +factor, and animate it in
    $('.ui.form')  
    .append('<div style="left: 500px; opacity: 0;" class="ui segment"> <div class="two factor fields"> <div class="field"> <label> Factor </label> <input type="text" name="factor' + counter + '"> </div> <div class="field"> <label> Weighting </label> <input type="text" name="weight' + counter + '"> </div> </div> <div class="two factor fields"> <div class="field"> <label> Option 1 Points </label> <input type="text" name="factor' + counter + '"> </div> <div class="field"> <label> Option 2 Points </label> <input type="text" name="weight' + counter + '"> </div> </div> </div>');      

    var odd = $('.ui.segment').length;
    var target = $('.ui.segment').last();

    if (odd % 2 == 0) {
      target.addClass('pink')
    } else {
      target.addClass('teal')
      target.css("left", "-500px");
    }

    $('.ui.segment').last().velocity({ opacity: 1, left: "0px" }, { 
      duration: "slow",
      begin: function() {
        // let's scroll to the newly created element
        target.get(0).scrollIntoView({block: "end", behavior: "smooth"});
      }
    });

    // increment the counter everytime we add a field
    counter++; 
  }