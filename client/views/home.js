var offsetPanorama = 1000;
var imgPanorama = 1;
var timerPanorama = null;
function slidePanorama() {
  offsetPanorama -= 1;
  if(offsetPanorama < 0) {
    offsetPanorama = 1000;
    imgPanorama = (imgPanorama + 1) % 2;
    $(".panorama>div").css("background-image",  'url("/img/panorama' + imgPanorama + '.jpg")');
  }
  $(".panorama>div").css("background-position-x", offsetPanorama);
}
Template.homePage.onCreated(function() {
    timerPanorama = Meteor.setInterval(slidePanorama, 40);
  });

Template.homePage.onDestroyed(function() {
    Meteor.clearInterval(timerPanorama);
  });


