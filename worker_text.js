var amqp = require('amqp');
var host = {
  host: '',
  port: '',
  login: '',
  password: ''
}
var connection = amqp.createConnection(host);
var PythonShell = require('python-shell');
var port = process.argv[2]

connection.on('ready', function () {
  console.log('INFO: connected with rabbitmq');

  connection.queue('text' ,function (q) {

    q.bind('#');
    q.subscribe({ ack: true }, function (message) {
      console.log('INFO: get new message');
      
      console.log("port")
      console.log(port)

      console.log("message")
      console.log(message)
      draw(port, "http://" + host.host + ":3000/uploads/" + message.text, function(err) {

        q.shift();

      });

    });
  });
});


function draw(port, filepath, callback) {
  var options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python',
    pythonOptions: ['-u'],
    scriptPath: '.',
    args: [ port, filepath ]
  };

  console.log('INFO: printing new message');

  console.log(options)
  PythonShell.run('worker_text.py', options, function (err) {

    if (err) {
      console.log(err)
      callback(err);
    }

    callback();

  });

}