/*Define dependencies.*/
var express = require("express");
var multer  = require('multer');
var serveStatic = require('serve-static')
var PythonShell = require('python-shell');
var app=express();
var done=false;
var printing=false;
var printFileName = "";

var uuid = require('node-uuid');
var amqp = require('amqp');
var host = {
  host: '',
  port: '',
  login: '',
  password: ''
}


var connection = amqp.createConnection(host);

connection.on('ready', function () {

  console.log('INFO: connected with rabbitmq');

});

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});

/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
pubnub.subscribe({
    channel  : "astatus",
    callback : function(message) {
      console.log(message)
      queue(message)
    }
});


function queue(message) {
  connection.publish('text', {
    'text': message.text
  });
}

