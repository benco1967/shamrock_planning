Meteor.publish("groups", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    console.log(">>>>>>> admin");
    return Groups.find({});
  }
  var groups = Roles.getGroupsForUser(this.userId);
  if (groups.length !== 0) {
    console.log(">>>>>>> member of " + JSON.stringify(groups));
    return Groups.find({_id: {$in: groups}});
  }
  else {
    console.log(">>>>>>> member of nothing");
    this.ready();
  }
});


Groups.find({}).observe({
  added: function (group) {
    console.log(">>>>>>>> new group " + JSON.stringify(group));
  }
});