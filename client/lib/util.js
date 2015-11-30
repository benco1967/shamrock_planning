Template.registerHelper('selectValue', function(data, value) {
  return data === value ? 'selected' : '';
});

dayToText = function(day) {
    return {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    }[day];
  }