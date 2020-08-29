const socket = io.connect('http://localhost:' + 3000)//CONSTANTS.PORT)
const theLight = document.getElementById('the-light')

// log the message, check if socket.io server is connected
socket.on('init', (data) => {
  console.log(data.message)
  socket.emit('data', { message: 'Client - Server connected, Socket.IO works.' })
});

function changePin() {
  console.log(document.getElementById("pin").value);
  socket.emit('data', { pin: document.getElementById("pin").value });
}

function changeKey() {
  console.log(document.getElementById("key").value);
  socket.emit('data', { key: document.getElementById("key").value });
}
