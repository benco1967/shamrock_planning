Meteor.publish("horses", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    return Horses.find({});
  }
  var groups = Roles.getGroupsForUser(this.userId);
  if (groups.length !== 0) {
    return Horses.find({owner: {$in: groups}});
  }
  else {
    this.ready();
  }
});