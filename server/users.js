Meteor.publish("allUserData", function () {

  if (Roles.userIsInRole(this.userId, "admin")) {
    return Meteor.users.find({},
      {fields: {'profile': 1, 'emails': 1, 'roles': 1}});
  } else {
    this.ready();
  }
});
