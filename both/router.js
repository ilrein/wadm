Router.onBeforeAction(function() {
  if (!Meteor.user()) {
    this.render('authenticate');
  } else {
    this.next();
  }
});

Router.configure({
  layoutTemplate: "applicationLayout"
})

Router.route('/', {
  template: "home",
  name: "home"
});

Router.route('/authenticate', {
  template: "authenticate",
  name: "authenticate"
});

Router.route('search');
Router.route('new');

Router.route('/show/:id', {
  // this template will be rendered until the subscriptions are ready
  loadingTemplate: 'loading',

  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('decision', this.params.id);
  },

  data: function() {
    return Decisions.findOne(this.params.id);
  },

  action: function () {
    this.render('show');
  }  
});