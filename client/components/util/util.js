angular.module('PlannerApp')
.filter('dayToText', function() {
  return function(day) {
    return {
      monday:    "Lundi",
      tuesday:   "Mardi",
      wednesday: "Mercredi",
      thursday:  "Jeudi",
      friday:    "Vendredi",
      saturday:  "Samedi",
      sunday:    "Dimanche"
    }[day];
  };
})
.filter('idToInstructor', function() {
  return function(id, attr) {
    var instructor = Instructors.findOne(id);
    return instructor ? instructor[attr || "name"] : "-";
  };
})
.filter('idToRider', function() {
  return function(id, attr) {
    var rider = Riders.findOne(id);
    return rider ? rider[attr || "name"] : "-";
  };
})
.filter('idToHorse', function() {
  return function(id, attr) {
    var horse = Horses.findOne(id);
    return horse ? horse[attr || "name"] : "-";
  };
})
.filter('isEmpty', function() {
  return function(obj) {
    if($.isPlainObject(obj)) return $.isEmptyObject(obj);
    if($.isArray(obj)) return obj.length === 0;
    return !!obj;
  };
})
.filter('isNotEmpty', function() {
  return function(obj) {
    if($.isPlainObject(obj)) return !$.isEmptyObject(obj);
    if($.isArray(obj)) return obj.length !== 0;
    return !obj;
  };
});
