Meteor.publish("horses", function (groupId) {
  check(groupId, String);
  // admin is ok
  if (Roles.userIsInRole(this.userId, "admin")) {
    return Horses.find({owner: groupId});
  }
  // user needs to be in the group
  var roles = Roles.getRolesForUser(this.userId, groupId);
  if(roles.length !== 0) {
    return Horses.find({owner: groupId});
  }
  // No accesss
  this.ready();
});