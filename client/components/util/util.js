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
  return function(id) {
    var instructor = Instructors.findOne(id);
    return instructor ? instructor.name : "-";
  };
});
