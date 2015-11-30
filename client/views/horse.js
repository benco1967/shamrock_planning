
Template.horseDisplay.helpers({
  getImage: function() {
    var horse = Template.currentData();
    return horse.image !== undefined ? horse.image : "/img/horseHead.png";
  }
});

Template.horseEditor.events({
  "submit form": function (event) {
    event.preventDefault();
  }
});

function newHorse() {
  return {
    name: "",
    creationDate: new Date()
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
      var image = getDataImage($form.find("canvas"), 128*1024);
      
      if(data !== undefined) {
        var set = {name: $form.find("#name").val()};
        switch(image) {
        case false: 
          Horses.update(data._id, {$set:set});
          break;
        case undefined:
          Horses.update(data._id, {$set:set, $unset: {image:""}});
          break;
        default:
          set.image = image;
          Horses.update(data._id, {$set:set});
          break;
        }
      }
      else {
        var horse = newHorse();
        horse.name = $form.find("#name").val();
        if(image !== false) horse.image = image;
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
