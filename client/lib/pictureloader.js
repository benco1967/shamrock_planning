



getDataImage = function($canvas, sizeMax) {
  if($canvas.data("imageUpdate") === false) return undefined;
  if($canvas.data("imageUpdate") !== true) return false;
  var canvas = $canvas[0];
  console.log("format image jpeg, taille max " + sizeMax);
  var result = null; 
  var compression = 0.95;
  do {
    result = canvas.toDataURL('image/jpeg', compression);
    console.log("compression jpeg " + compression + " => " + (result.length / 1024));
    compression -= 0.01;
  } while(compression > 0.2 && result.length > sizeMax);
  console.log("Image de " + (result.length / 1024) + "ko");
  return result;
}
Template.pictureLoader.onCreated(function() {
    var defaultOptions = {
      width: 140,
      height: 140,
      defaultImage: "/img/upload.png"
    };
    if(!this.data.options) {
      this.data.options = defaultOptions;
    }
    else {
      $.extend(this.data.options, defaultOptions);
    }
    
  });
Template.pictureLoader.onRendered(function() {
    var $canvas = this.$("canvas");
    var canvas = $canvas[0];
    canvas.width = this.data.options.width; 
    canvas.height = this.data.options.height; 
    var tmp = new Image();
    tmp.onload = function() {
      var ctxCanvas = canvas.getContext('2d');
      ctxCanvas.drawImage(tmp, 0, 0, canvas.width, canvas.height);
    };
    tmp.src = this.data.image ? this.data.image : this.data.options.defaultImage;
  });
Template.pictureLoader.events({
  "click #uploadImg": function(event, template) { 
    var $input = template.$('#inputImage');
    $input.unbind("change").change(function() {
      if(!!this.files && !!this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var tmp = new Image();
          tmp.onload = function() {
            var $canvas = template.$("canvas");
            $canvas.data("imageUpdate", true);
            var canvas = $canvas[0];
            var ctxCanvas = canvas.getContext('2d');
            var cw = canvas.width;
            var ch = canvas.height; 
            ctxCanvas.clearRect(0, 0, cw, ch);
            var w = tmp.width;
            var h = tmp.height;
            var ratio = Math.min(h / ch, w / cw);
            var nw = w / ratio;
            var nh = h / ratio;
            ctxCanvas.drawImage(tmp, (cw - nw)/2, (ch - nh)/2, nw, nh);
          };
          tmp.src = e.target.result;
        };       
        reader.readAsDataURL(this.files[0]);
      }
      $input.unbind("change").val(""); // pour que la prochaine fois il prenne en compte le changement même si c'est le même fichier
    }); 
    $input.click();
  },
  "click #resetImg": function(event, template) {
    var $canvas = template.$("canvas");
    $canvas.data("imageUpdate", false);
    var tmp = new Image();
    tmp.onload = function() {
      var $canvas = template.$("canvas");
      var canvas = $canvas[0];
      var ctxCanvas = canvas.getContext('2d');
      ctxCanvas.drawImage(tmp, 0, 0, canvas.width, canvas.height);
    };
    tmp.src = this.options.defaultImage;
  }
});