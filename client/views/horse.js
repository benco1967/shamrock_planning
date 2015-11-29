
Template.horseDisplay.helpers({
  getImage: function() {
    var horse = Template.currentData();
    return horse.image !== undefined ? horse.image : "/img/horseHead.png";
  }
});

function newHorse() {
  return {
    name: ""
  }
}

Template.horsesPage.helpers({
  horses: function() {
    return Horses.find({});
  },
  horsesCollection: function() {
    return Horses;
  },
  newHorseDefault: newHorse,
  saveHorse: function() {
    return function($form, data) {
      if(data !== undefined) {
        Horses.update(data._id, {$set:{name: $form.find("#name").val()}});
      }
      else {
        var horse = newHorse();
        horse.name = $form.find("#name").val();
        Horses.insert(horse);
      }
    };
  },
  resetHorseForm: function() {
    return function($form) {
      $form.find("#name").val("");
    };
  }
});

Template.horsesPage.events({
  "submit .new-horse": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var name = event.target.name.value;

    // Insert a new horse into the collection
    Horses.insert({
      name: name,
      createdAt: new Date() // current time   
    });

    // Clear form
    event.target.name.value = "";
  }
});
