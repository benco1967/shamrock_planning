
Template.lessonDisplay.helpers({
  value: dayToText,
  instructor: function() {
    return Instructors.findOne(this.instructor_id);
  }
});

Template.lessonEditor.helpers({
  instructors: function() {
    return Instructors.find({});
  }
});

Template.lessonEditor.events({
  "submit form": function (event) {
    event.preventDefault();
  }
});

function newLesson() {
  return {
    day: "saturday",
    hour: "10:00",
    instructor_id: null,
    creationDate: new Date()
  }
}

Template.lessonsPage.helpers({
  lessons: function() {
    return Lessons.find({});
  },
  lessonsCollection: function() {
    return Lessons;
  },
  newLessonDefault: newLesson,
  saveLesson: function() {
    return function($form, data) {
      var image = getDataImage($form.find("canvas"), 128*1024);
      
      if(data !== undefined) {
        var set = {
          day: $form.find("#day").val(),
          hour: $form.find("#hour").val(),
          instructor_id: $form.find("#instructor").val()
        };
        Lessons.update(data._id, {$set:set});
      }
      else {
        var lesson = newLesson();
        lesson.day = $form.find("#day").val();
        lesson.hour = $form.find("#hour").val();
        lesson.instructor_id = $form.find("#instructor").val();
        Lessons.insert(lesson);
      }
    };
  },
  resetLessonForm: function() {
    return function($form) {
      $form.find("#day").val("saturday");
      $form.find("#hour").val("10:00");
    };
  }
});
