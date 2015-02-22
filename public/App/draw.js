var canvasDiv = document.getElementById('canvasDiv');
var img_u8;
var useCandyEdge = false;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var drawimage = false;

canvas = document.createElement('canvas');
canvas.setAttribute('width', 300);
canvas.setAttribute('height', 300);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);

var streaming = false,
    video = document.querySelector('#video'),
    width = canvas.width,
    height = canvas.height,
    rederVideo;

if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

context = canvas.getContext("2d");

$( "#camera" ).hide()
$("#filterMode").hide();

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

    if (useCandyEdge) {

      context.drawImage(video, 0, (context.canvas.height - video.height) / 2, video.width, video.height);

      var imageData = context.getImageData(0, (context.canvas.height - video.height) / 2, video.width, video.height);
      var r = 2;
      var kernel_size = (r+1) << 1;

      jsfeat.imgproc.grayscale(imageData.data, video.width, video.height, img_u8);
      jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
      jsfeat.imgproc.canny(img_u8, img_u8, 1, 50);
      
      var data_u32 = new Uint32Array(imageData.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols*img_u8.rows, pix = 0;
      while(--i >= 0) {
          pix = img_u8.data[i];
          data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
      }

      var data = imageData.data;

      for(var i = 0; i < data.length; i += 4) {
        // red
        data[i] = 255 - data[i];
        // green
        data[i + 1] = 255 - data[i + 1];
        // blue
        data[i + 2] = 255 - data[i + 2];
      }

      context.putImageData(imageData, 0, (context.canvas.height - video.height) / 2);

    }

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

$( "#filter_canny" ).click(function(e) {
  useCandyEdge = true;
  redraw();
});

$( "#filter_canny_reset" ).click(function(e) {
  useCandyEdge = false;
  redraw();
});

$( "#takepicture" ).click(function(e) {
  takepicture();
  $("#takepictureMode").hide();
  $("#drawMode").show();
  if (drawimage) {
    $("#filterMode").show();
  }
});

$( "#cancelTakepicture" ).click(function(e) {
  $("#takepictureMode").hide();
  $("#drawMode").show();
  if (drawimage) {
    $("#filterMode").show();
  }
});

$( "#camera" ).click(function(e) {
  e.preventDefault();

  $("#takepictureMode").show();
  $("#drawMode").hide();
  $("#filterMode").hide();
  
  img_u8 = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8C1_t);
  video.play();
})

$( "#reset" ).click(function() {
  $("#filterMode").hide();
  
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  drawimage = false;
  useCandyEdge = false;
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

