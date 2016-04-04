Meteor.publish("groups", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    return Groups.find({});
  }
  var groups = Roles.getGroupsForUser(this.userId);
  if (groups.length !== 0) {
    return Groups.find({_id: {$in: groups}});
  }
  else {
    this.ready();
  }
});


Groups.find({}).observe({
  added: function (group) {
    console.log(">>>>>>>> new group " + JSON.stringify(group));
  }
});