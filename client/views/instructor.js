
Template.instructorDisplay.helpers({
  getImage: function() {
    var instructor = Template.currentData();
    return instructor.image !== undefined ? instructor.image : (instructor.gender === "male" ? "/img/manHead.png" : "/img/womanHead.png");
  }
});


Template.instructorEditor.events({
  "submit form": function (event) {
    event.preventDefault();
  }
});

function newInstructor() {
  return {
    name: "",
    gender: "female",
    creationDate: new Date()
  }
}

Template.instructorsPage.helpers({
  instructors: function() {
    return Instructors.find({});
  },
  instructorsCollection: function() {
    return Instructors;
  },
  newInstructorDefault: newInstructor,
  saveInstructor: function() {
    return function($form, data) {
      var image = getDataImage($form.find("canvas"), 128*1024);
      
      if(data !== undefined) {
        var set = {
          name: $form.find("#name").val(),
          gender: getGender($form)
        };
        
        switch(image) {
        case false: 
          Instructors.update(data._id, {$set:set});
          break;
        case undefined:
          Instructors.update(data._id, {$set:set, $unset: {image:""}});
          break;
        default:
          set.image = image;
          Instructors.update(data._id, {$set:set});
          break;
        }
      }
      else {
        var instructor = newInstructor();
        instructor.name = $form.find("#name").val();
        instructor.gender = getGender($form);
        if(image !== false) instructor.image = image;
        Instructors.insert(instructor);
      }
    };
  },
  resetInstructorForm: function() {
    return function($form) {
      $form.find("#name").val("");
    };
  }
});
