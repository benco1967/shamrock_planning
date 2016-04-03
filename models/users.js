/**
 * Created by benoit.chanclou on 04/04/2016.
 */

Meteor.users.allow({
  insert: function (userId, user) {
    return true;
  },
  update: function (userId, user, fields, modifier) {
    console.log(">>>>>> update user" + JSON.stringify(user));
    console.log(">>>>>> update user admin " + Roles.userIsInRole(userId, "admin"));
    console.log(">>>>>> update user himself" + (userId == user._id));
    return Roles.userIsInRole(userId, "admin") || userId == user._id;
  },
  remove: function (userId, user) {
    return Roles.userIsInRole(userId, "admin");
  }
});
