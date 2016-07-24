


function loadNextDrawStep() {
  var http = new XMLHttpRequest();
  var url = "/camera_image";
  http.open("GET", url, true);
  http.onreadystatechange = function(err) {
    if (http.readyState == 4 && http.status == 200){
      map1.loadDifferentImage(http.responseText);
    } else {
      console.log(err);
    }
  };
  //http.setRequestHeader('Content-Type', 'application/json');
  http.send(data);
}

function loadNextDrawStep() {
  map1.loadDifferentImage("/camera_image");
}

function sendCameraSnapshot() {
  snapshot();
  var canvas = document.getElementById('camcanvas');
  var base64 = canvas.toDataURL('image/jpeg')
  var http = new XMLHttpRequest();
  var url = "/camera_image";
  http.open("POST", url, true);
  http.onreadystatechange = function(err) {
    if (http.readyState == 4 && http.status == 200){
      loadNextDrawStep();
      console.log(http.responseText);
    } else {
      console.log(err);
    }
  };
  data = JSON.stringify({img: base64});
  http.setRequestHeader('Content-Type', 'application/json');
  http.send(data);
}

