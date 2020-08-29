const express = require('express')
const socket = require('socket.io')
const http = require('http')

const { fork } = require('child_process');

// TODO : do I need module.exports?
module.exports = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new socket(server);
  const port = 3000; // TODO replace with constant

  // TODO : somehow, need to get a whole configured inputs object struct from the frontend
  function padawan() {
    var child = fork(__dirname + '/board');

    child.on('message', (message) => {
      console.log('Creating Johnny-Five Board');
      console.log(message);
    });

    child.send('START');

    return child;
  }

  var child = padawan(); // Connect to the board on start

  // on Socket.io connection
  io.on('connection', (client) => {
    client.emit('init', { message: 'Server - Client connected, Socket.IO works.' });

    client.on('data', (msg) => {

      var state_change = false;

      if ('message' in msg) {
        console.log('message: ' + msg.message);
      }

      // check if msg has a pin/key
      if ('pin' in msg) {
        input_key = msg.pin;
        console.log('pin changed');

        state_change = true;
      }
      if ('key' in msg) {
        output_key = msg.key;
        console.log('key changed');

        state_change = true;
      }

      if (state_change) {
        child.kill();
        child = padawan();
      }

    });
  });

  // make server listen to the preconfigured port
  server.listen(port);
}