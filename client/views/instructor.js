
Template.instructorDisplay.helpers({
  getImage: function() {
    var instructor = Template.currentData();
    return instructor.image !== undefined ? instructor.image : "/img/manHead.png";
  }
});

function newInstructor() {
    return {
      name: ""
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
      if(data !== undefined) {
        Instructors.update(data._id, {$set:{name: $form.find("#name").val()}});
      }
      else {
        var instructors = newInstructor();
        instructors.name = $form.find("#name").val();
        Instructors.insert(instructors);
      }
    };
  },
  resetInstructorForm: function() {
    return function($form) {
      $form.find("#name").val("");
    };
  }
});

Template.instructorsPage.events({
  "submit .new-instructor": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var name = event.target.name.value;

    // Insert a new instructor into the collection
    Instructors.insert({
      name: name,
      createdAt: new Date() // current time   
    });

    // Clear form
    event.target.name.value = "";
  }
});
