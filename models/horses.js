Horses = new Mongo.Collection('horses');

Horses.allow({
  insert: function (userId, horse) {
    return Roles.userIsInRole(userId, "admin") || Roles.userIsInRole(userId, "manager", horse.owner);
  },
  update: function (userId, horse, fields, modifier) {
    return Roles.userIsInRole(userId, "admin") || Roles.userIsInRole(userId, "manager", horse.owner);
  },
  remove: function (userId, horse) {
    return Roles.userIsInRole(userId, "admin") || Roles.userIsInRole(userId, "manager", horse.owner);
  },
  fetch: ['owner']
});