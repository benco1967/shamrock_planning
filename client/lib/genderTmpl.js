
getGender = function($form) {
  var genderSelected = $form.find(".genderBtn input[type='radio']:checked");
  if (genderSelected.length > 0) {
    return genderSelected.attr("id");
  }
  return null;
}
Template.genderBtn.helpers({
  isMale: function() {
    var template = Template.instance();
    return this == "male";
  },
  isFemale: function() {
    var template = Template.instance();
    return this == "female";
  }
});
