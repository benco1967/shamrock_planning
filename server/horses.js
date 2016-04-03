Meteor.publish("horses", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    console.log(">>>>>>> admin");
    return Horses.find({});
  }
  var groups = Roles.getGroupsForUser(this.userId);
  if (groups.length !== 0) {
    console.log(">>>>>>> member of " + JSON.stringify(groups));
    return Horses.find({owner: {$in: groups}});
  }
  else {
    console.log(">>>>>>> member of nothing");
    this.ready();
  }
});