
currentPage = new ReactiveVar("home");

Template.body.helpers({
  isCurrentPage: function(value) {
    return currentPage.get() === value;
  },
  currentPageTemplate: function() {
    return currentPage.get() + "Page";
  }
});

Template.body.events({
  "click nav a.menu": function (event) {
    event.preventDefault();
    currentPage.set(event.target.id);
  }
});
