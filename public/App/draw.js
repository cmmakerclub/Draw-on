var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', 300);
canvas.setAttribute('height', 300);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);

if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

context = canvas.getContext("2d");

$( "#camera" ).hide()

DetectRTC.load(function() {
    // DetectRTC.hasWebcam (has webcam device!)
    // DetectRTC.hasMicrophone (has microphone device!)
    // DetectRTC.hasSpeakers (has speakers!)
    if (DetectRTC.browser.isChrome || DetectRTC.browser.isFirefox) {

      $( "#camera" ).show()

      navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      navigator.getMedia(
        {
          video: true,
          audio: false
        },
        function(stream) {
          if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
          } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
          }
        },
        function(err) {
          console.log("An error occured! " + err);
        }
      );
    }
    // DetectRTC.isSctpDataChannelsSupported
    // DetectRTC.isRtpDataChannelsSupported
    // DetectRTC.isAudioContextSupported
    // DetectRTC.isWebRTCSupported
    // DetectRTC.isDesktopCapturingSupported
    // DetectRTC.isMobileDevice
    // DetectRTC.isWebSocketsSupported
    
    // DetectRTC.osName
    
    // DetectRTC.browser.name
    // DetectRTC.browser.version
    // DetectRTC.browser.isChrome
    // DetectRTC.browser.isFirefox
    // DetectRTC.browser.isOpera
    // DetectRTC.browser.isIE
    // DetectRTC.browser.isSafari

    // DetectRTC.DetectLocalIPAddress(callback)
});

var streaming = false,
    video        = document.querySelector('#video'),
    width = canvas.width,
    height = canvas.height,
    rederVideo;

$("#takepictureMode").hide()

var mousedown = function(e) {
  e.preventDefault();
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
    
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
}

var touchmove = function(e){
  e.preventDefault();
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
}

var mouseup = function(e) {
  paint = false;
}

canvas.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("touchstart", mousedown, false);

canvas.addEventListener("touchmove", touchmove, false);
canvas.addEventListener("mousemove", touchmove, false);

canvas.addEventListener("mouseup", mouseup, false);
canvas.addEventListener("mouseleave", mouseup, false);
canvas.addEventListener("touchend", mouseup, false);


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var drawimage = false;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.fillStyle   = '#FFFFFF'; // set canvas background color
  context.fillRect(0, 0, context.canvas.width, context.canvas.height)

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;
      
  if (drawimage) {
    canvas.getContext('2d').drawImage(video, 0, (context.canvas.height - video.height) / 2, video.width, video.height);
  }

  for(var i=0; i < clickX.length; i++) {    
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.strokeStyle = "#000000"
     context.stroke();
  }
}

video.addEventListener('canplay', function(ev){
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    // canvas.setAttribute('width', width);
    // canvas.setAttribute('height', height);
    streaming = true;
  }
}, false);

function takepicture() {
  drawimage = true;
  redraw();
  video.pause()
}

$( "#takepicture" ).click(function(e) {
  takepicture()
  $("#takepictureMode").hide()
  $("#drawMode").show()
});

$( "#cancelTakepicture" ).click(function(e) {
  $("#takepictureMode").hide()
  $("#drawMode").show()
});

$( "#camera" ).click(function(e) {
  e.preventDefault();

  $("#takepictureMode").show();
  $("#drawMode").hide();

  video.play();
})

$( "#reset" ).click(function() {
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  drawimage = false;
  redraw();
})

$( "#upload" ).click(function() {
  var data = new FormData();  
  var blobBin = atob(canvas.toDataURL().split(',')[1]);
  var array = [];

  for(var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
  }

  var file = new Blob([new Uint8Array(array)], {type: 'image/png'});

  data.append("file-1", file, "draw-image.png");

  jQuery.ajax({
      url: 'api/photo',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function(data){
          swal("(=ↀωↀ=)✧!", "waitting for your picture!", "success")
      }
  });
});

function resize() {

    var canvas = document.getElementById('canvas');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

// window.addEventListener('resize', resize, false);

