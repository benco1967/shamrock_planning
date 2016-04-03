Groups = new Mongo.Collection('groups');

Groups.allow({
  insert: function (userId, group) {
    return Roles.userIsInRole(userId, "admin");
  },
  update: function (userId, group, fields, modifier) {
    return Roles.userIsInRole(userId, "manager", group._id);
  },
  remove: function (userId, group) {
    return Roles.userIsInRole(userId, "admin");
  }
});
