Meteor.publish("allUserData", function () {

  if (Roles.userIsInRole(this.userId, "admin")) {
    return Meteor.users.find({},
      {fields: {'profile': 1, 'emails': 1, 'roles': 1}});
  }
  this.ready();
});

Meteor.publish("currentUserGroup", function () {
  // must get the roles to get the groups
  return Meteor.users.find({_id: this.userId},
     {fields: {'profile': 1, 'emails': 1, 'roles': 1}});
});

