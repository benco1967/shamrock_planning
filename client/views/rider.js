
Template.riderDisplay.helpers({
  getImage: function() {
    var rider = Template.currentData();
    return rider.image !== undefined ? rider.image : "/img/womanHead.png";
  }
});

Template.riderEditor.onRendered(function() {
    initCanvas(this.$("canvas"), 140, 140, this.data.image, "/img/upload.png");
  });
Template.riderEditor.events({
  "submit form": function (event) {
    event.preventDefault();
  },
  "click #uploadImg": function(event, template) { 
    loadImage(template.$('#inputImage'), template.$("canvas")); 
  },
  "click #resetImg": function(event, template) { 
    resetImage(template.$("canvas"), "/img/upload.png"); 
  }
});

function newRider() {
  return {
    name: "",
    creationDate: new Date()
  }
}
  
Template.ridersPage.helpers({
  riders: function() {
    return Riders.find({});
  },
  ridersCollection: function() {
    return Riders;
  },
  newRiderDefault: newRider,
  saveRider: function() {
    return function($form, data) {
      var image = getDataImage($form.find("canvas"), 128*1024);
      
      if(data !== undefined) {
        var set = {name: $form.find("#name").val()};
        switch(image) {
        case false: 
          Riders.update(data._id, {$set:set});
          break;
        case undefined:
          Riders.update(data._id, {$set:set, $unset: {image:""}});
          break;
        default:
          set.image = image;
          Riders.update(data._id, {$set:set});
          break;
        }
      }
      else {
        var rider = newRider();
        rider.name = $form.find("#name").val();
        if(image !== false) rider.image = image;
        Riders.insert(rider);
      }
    };
  },
  resetRiderForm: function() {
    return function($form) {
      $form.find("#name").val("");
    };
  }
});
