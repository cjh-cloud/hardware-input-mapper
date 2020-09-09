const express = require('express');
const socket = require('socket.io');
const http = require('http');
const Store = require('electron-store');
const store = new Store();

const { fork } = require('child_process');

// TODO : do I need module.exports?
module.exports = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new socket(server);
  const port = 3000; // TODO replace with constant

  // Default config
  var input_config = {
    button  : [],
    encoder : []
  };

  // Load Config
  try {
    if (store.get('config')) {
      input_config = store.get('config');
    } else {
      store.set('config', input_config);
    }
    console.log(input_config);
  } catch(err) {
    console.error(err);
  }


  // Create child process
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

      // Save updated config and recreate child proc
      if ('config' in msg) {
        input_config = msg.config;
        store.set('config', input_config);
        child.kill();
        child = padawan(input_config);
      }

    });
  });

  // make server listen to the preconfigured port
  server.listen(port);
}