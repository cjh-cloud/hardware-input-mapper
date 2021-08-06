// const express = require('express');
// const socket = require('socket.io');
import express from "express";
// import * as socket from "socket.io";
import { Server, Socket } from "socket.io";
import http from "http";
import { ChildProcess, fork } from "child_process";
const Store = require('electron-store');
const store = new Store();

const e_app = express();
const e_server = http.createServer(e_app);
// const io = new socket(e_server);
let io = new Server(e_server);
const port = 3000;
let child: ChildProcess | null;

const anakin = function () {
  if (child)
    child.kill();
}

interface Message {
  connected: Boolean
}

// Create child process
function padawan(board_config: object) {
  if (!JSON.stringify(board_config).includes('""')) {
    let new_child = fork(__dirname + '/board');

    // What to do when receiving message from child proc
    new_child.on('message', (message: Message) => {
      if ('connected' in message)
        if (!message.connected)
          anakin();
    });

    // Send board config to child proc
    new_child.send(board_config);

    return new_child;
  }
  return null;
}

const initServer = function () {

  // Default config
  let input_config = {
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

  child = padawan(input_config); // Connect to the board on start

  // on Socket.io connection
  io.on('connection', (client) => {

    // Send the board config to the board on connection
    client.emit('config', input_config);

    client.on('data', (msg) => {

      // Save updated config and recreate child proc
      if ('config' in msg) {
        input_config = msg.config;
        store.set('config', input_config);
        anakin();
        child = padawan(input_config);
      }

    });
  });

  // make server listen to the preconfigured port
  e_server.listen(port);

}

module.exports = {
  anakin : anakin,
  initServer : initServer
}