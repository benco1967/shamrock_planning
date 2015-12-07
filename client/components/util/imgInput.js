angular.module('PlannerApp')

.directive('imgInput', ['$q', function($q) {
  function onChangeUrl(scope, url, sizeMax) {
    return $q(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var tmp = new Image();
        tmp.onload = function() {
          var canvas = scope._$canvas[0];
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
          
          console.log("format image jpeg, taille max " + sizeMax);
          var result = null; 
          var compression = 0.95;
          do {
            result = canvas.toDataURL('image/jpeg', compression);
            console.log("compression jpeg " + compression + " => " + (result.length / 1024));
            compression -= 0.01;
          } while(compression > 0.2 && result.length > sizeMax);
          console.log("Image de " + (result.length / 1024) + "ko");
          resolve(result);
        };
        tmp.onerror = function() {
          reject();
        };
        tmp.src = e.target.result;
      };       
      reader.readAsDataURL(url);
    });
  };
  
  function resetImg($scope) {
    var tmp = new Image();
    tmp.onload = function() {
      var canvas = $scope._$canvas[0];
      var ctxCanvas = canvas.getContext('2d');
      ctxCanvas.drawImage(tmp, 0, 0, canvas.width, canvas.height);
      $scope.modeDelete = false;
      $scope._ctrl.$setViewValue(null);
    };
    tmp.src = $scope.defaultImage || "img/upload.png";
  };
  
  function uploadImg($scope) {
    $scope._$input.unbind("change").change(function() {
      if(!!this.files && !!this.files[0]) {
        onChangeUrl($scope, this.files[0], $scope.sizeMax || 524288).then(function(result) {
          $scope.modeDelete = true;
          $scope._ctrl.$setViewValue(result);
        });
      }
      $scope._$input.unbind("change").val(""); // pour que la prochaine fois il prenne en compte le changement même si c'est le même fichier
    });
    $scope._$input.click();
  };
  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      width: '@',
      height: '@',
      sizeMax: '@',
      defaultImage: '@'
    },
    controller: function($scope) {
      $scope._$canvas = null;
      $scope._$input = null;
      $scope._ctrl = null;
      var width = $scope.width || 140; 
      var height = $scope.height || 140; 
      $scope.styleBtn = {position: "absolute", left: (width - 35) + "px", top: (height - 30) + "px"};
      $scope.styleCanvas = { position: "relative", width: width + "px", height: height + "px" };
      $scope.toggle = function() {
        if($scope.modeDelete) {
          resetImg($scope);
        }
        else {
          uploadImg($scope);
        }
      };
      
    },
    link: function (scope, elt, attrs, ctrl) {
      // init
      scope._$input = elt.find("#inputImage");
      scope._$canvas = elt.find("#canvasImage");
      scope._ctrl = ctrl;
      var canvas = scope._$canvas[0];
      canvas.width = scope.width || 140; 
      canvas.height = scope.height || 140; 
     
      ctrl.$render = function() {
        scope.modeDelete = !!ctrl.$modelValue;
        var image = ctrl.$modelValue ? ctrl.$modelValue : (scope.defaultImage || "/img/upload.png");
        var tmp = new Image();
        tmp.onload = function() {
          var ctxCanvas = canvas.getContext('2d');
          ctxCanvas.drawImage(tmp, 0, 0, canvas.width, canvas.height);
        };
        tmp.src = image;
      };

    },
    templateUrl: 'client/components/util/imgInput.html'
  };
}]);