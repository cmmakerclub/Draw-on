/*Define dependencies.*/

var express=require("express");
var multer  = require('multer');
var serveStatic = require('serve-static')
var PythonShell = require('python-shell');
var app=express();
var done=false;
var printing=false;
var printFileName = ""


var options = {
  mode: 'text',
  pythonPath: '/usr/local/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/Users/admin/Documents/project/Draw On/',
  // args: ['value1', 'value2', 'value3']
};

/*Configure the multer.*/

app.use(serveStatic('public/'))

app.use(multer({ dest: './public/uploads/',
 rename: function (fieldname, filename) {
    var fileName = filename+Date.now();
    printFileName = fileName;
    return 'draw-on';//fileName;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
}));

/*Handling routes.*/

app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
  if(done==true){

    PythonShell.run('draw-on.py', options, function (err) {
      if (err) throw err;
      console.log('finished');
    });

    console.log(req.files);
    res.end("File uploaded.");

  }
});

/*Run the server.*/
app.listen(3001,function(){
    console.log("Working on port 3000");
});
