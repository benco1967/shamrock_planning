loadImage = function($inputFile, $canvas) {
  $inputFile.unbind("change").change(function() {
    changeImage($canvas, this);
    $inputFile.unbind("change");
    $inputFile.val(""); // pour que la prochaine fois il prenne en compte le changement même si c'est le même fichier
  }); 
  $inputFile.click();
}
resetImage = function($canvas, defaultImageUrl) {
  $canvas.data("imageUpdate", false);
  var tmp = new Image();
  tmp.onload = function() {
    var canvas = $canvas[0];
    var ctxCanvas = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height; 
    ctxCanvas.drawImage(tmp, 0, 0, cw, ch);
  };
  tmp.src = defaultImageUrl;
}

initCanvas = function($canvas, width, height, image, defaultImageUrl) {
  var canvas = $canvas[0];
  canvas.width = width; 
  canvas.height = height; 
  var tmp = new Image();
  tmp.onload = function() {
    var ctxCanvas = canvas.getContext('2d');
    ctxCanvas.drawImage(tmp, 0, 0, width, height);
  };
  tmp.src = image ? image : defaultImageUrl;
}

function changeImage($canvas, input) {
  if(!!input.files && !!input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      image = new Image();
      image.onload = function() {
        updateImage($canvas, image);
      };
      image.src = e.target.result;
    };       
    reader.readAsDataURL(input.files[0]);
  }
}
updateImage = function($canvas, image) {
  $canvas.data("imageUpdate", true);
  var canvas = $canvas[0];
  var ctxCanvas = canvas.getContext('2d');
  var cw = canvas.width;
  var ch = canvas.height; 
  ctxCanvas.clearRect(0, 0, cw, ch);
  var w = image.width;
  var h = image.height;
  var ratio = Math.min(h / ch, w / cw);
  var nw = w / ratio;
  var nh = h / ratio;
  ctxCanvas.drawImage(image, (cw - nw)/2, (ch - nh)/2, nw, nh);
}
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