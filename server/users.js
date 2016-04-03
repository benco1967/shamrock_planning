Meteor.publish("allUserData", function () {
  if (Roles.userIsInRole(this.userId, "admin")) {
    return Meteor.users.find({},
      {fields: {'profile': 1, 'emails': 1, 'groups': 1}});
  } else {
    this.ready();
  }
});

Meteor.users.find({}).observeChanges({
  changed: function (id, fields) {
    console.log(">>>>>>>> change user " + JSON.stringify(fields));
    if(fields.groups) {
      for(var i in fields.groups) {

        var group = fields.groups[i];
        if(!Roles.userIsInRole(id, "member", group)) {
          Roles.addUsersToRoles(id, "member", group);
          console.log(">>>> Add group " + group);
        }
      }
    }
  }
});