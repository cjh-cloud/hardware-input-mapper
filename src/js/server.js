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

  // TODO : read from a JSON file to get the structure...
  var input_config = {
    button  : [],
    joystick: [],
    encoder : []
  };

  // TODO : somehow, need to get a whole configured inputs object struct from the frontend
  function padawan(board_config) {
    var child = fork(__dirname + '/board');

    // What to do when receiving message from child proc
    child.on('message', (message) => {
      console.log('Creating Johnny-Five Board');
      console.log(message);
    });

    // Send message to child proc
    child.send('START');
    child.send(board_config);

    return child;
  }

  var child = padawan(input_config); // Connect to the board on start

  // on Socket.io connection
  io.on('connection', (client) => {
    client.emit('init', { message: 'Server - Client connected, Socket.IO works.' });

    client.emit('config', input_config);

    client.on('data', (msg) => {

      if ('message' in msg) {
        console.log('message: ' + msg.message);
      }

      // TODO
      if ('config' in msg) {
        // Compare msg.config with what we currently have (from json file eg)
        child.kill();
        child = padawan(msg.config);
        console.log("test");
        console.log(msg.config);
      }

    });
  });

  // make server listen to the preconfigured port
  server.listen(port);
}