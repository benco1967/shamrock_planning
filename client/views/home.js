var offsetPanorama = 1000;
var imgPanorama = 0;
var timerPanorama = null;
function slidePanorama() {
  offsetPanorama -= 1;
  if(offsetPanorama < 0) {
    offsetPanorama = 1000;
    imgPanorama = (imgPanorama + 1) % 2;
    $(".panorama>div").css("background-image",  'url("/img/panorama' + imgPanorama + '.jpg")');
  }
  $(".panorama>div").css("background-position", "" + offsetPanorama + "px 0px");
}
Template.homePage.onCreated(function() {
    timerPanorama = Meteor.setInterval(slidePanorama, 40);
  });

Template.homePage.onDestroyed(function() {
    Meteor.clearInterval(timerPanorama);
  });


