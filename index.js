/*Define dependencies.*/
var express=require("express");
var multer  = require('multer');
var serveStatic = require('serve-static')
var PythonShell = require('python-shell');
var app=express();
var done=false;
var printing=false;
var printFileName = "";

var uuid = require('node-uuid');
var amqp = require('amqp');
var connection = amqp.createConnection();

connection.on('ready', function () {

  console.log('INFO: connected with rabbitmq');

});

/*Configure the multer.*/

app.use(serveStatic('public/'));

app.use(multer({
  dest: './public/uploads/',
  rename: function (fieldname, filename) {
    return uuid.v4();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}));

/*Handling routes.*/

app.get('/', function (req, res){
      res.sendfile("index.html");
});

app.post('/api/photo', function (req, res) {
  var fileObj = req.files['file-1'];
  if (fileObj) {
    queue(fileObj);
  }
});

/*Run the server.*/
app.listen(3000, function () {
    console.log("Working on port 3000");
});

function queue(fileObj) {
  connection.publish('draw', {
    'filepath': fileObj.path
  });
}

