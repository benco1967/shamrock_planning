Horses = new Mongo.Collection('horses');

Horses.allow({
  insert: function (userId, horse) {
    return !!userId;
  },
  update: function (userId, horse, fields, modifier) {
    return !!userId;
  },
  remove: function (userId, horse) {
    return !!userId;
  }
});