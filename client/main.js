
currentPage = new ReactiveVar("home");

Template.body.helpers({
  isCurrentPage: function(value) {
    return currentPage.get() === value;
  }
});

Template.body.events({
  "click nav a": function (event) {
    event.preventDefault();
    currentPage.set(event.target.id);
  }
});
