Template.applicationLayout.events({
  'click [data-logout]': function() {
    Meteor.logout();
  }
})