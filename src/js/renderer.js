const socket = io.connect('http://localhost:' + 3000);

var input_config;

// log the message, check if socket.io server is connected
socket.on('init', (data) => {
  console.log(data.message);
  socket.emit('data', { message: 'Client - Server connected, Socket.IO works.' });
});

socket.on('config', (data) => {
  input_config = data;
})

// Update config JSON
function change(input_name) {
  console.log(document.getElementById(input_name).value);

  var input_name_elements = input_name.split("_"); // e.g. pin_0 -> [pin, 0]
  var type = input_name_elements[0]; // e.g. button
  var name = input_name_elements[1]; // e.g. pin
  var index = input_name_elements[2]; // e.g. 0

  input_config[type][index][name] = document.getElementById(input_name).value;

  // send new input_config to server via socketio
  socket.emit('data', { config: input_config });
}

// Add new button config elements
function addBtn() {
  var btnsDiv = document.getElementById('buttons');
  var index = input_config.button.length;

  var new_btn_cfg = document.createElement('div');
  new_btn_cfg.id = 'button_' + index;
  new_btn_cfg.innerHTML = `<input type='text' id='button_pin_${index}' name='button_pin_${index}' onchange='change(this.name)'>
  <input type='text' id='button_key_${index}' name='button_key_${index}' onchange='change(this.name)'>
  <button name='button_${index}' onclick='delBtn(this.name)'>Del</button>`

  btnsDiv.appendChild(new_btn_cfg);

  input_config.button.push({pin: null, key: null});

  socket.emit('data', { config: input_config }); // * updating with empty button config
}

function delBtn(button_id) {
  var index = button_id.split("_")[1]; // e.g. button_0, gets 0
  input_config.button.splice(index, 1);

  // Remove the entire buttons div
  var buttons = document.querySelector('#buttons');
  buttons.parentNode.removeChild(buttons);

  // Create new buttons div and recreate button configs
  new_buttons = document.createElement('div')
  new_buttons.id = 'buttons';

  var new_buttons_html = '';

  for (var i=0; i<input_config.button.length; i++) {
    new_buttons_html += `<div class='button' id='button_${i}'>
    <input type='text' id='button_pin_${i}' name='button_pin_${i}' onchange='change(this.name)' value='${input_config.button[i].pin}'>
    <input type='text' id='button_key_${i}' name='button_key_${i}' onchange='change(this.name)' value='${input_config.button[i].key}'>
    <button name='button_${i}' onclick='delBtn(this.name)'>🗑️</button>
    </div>`
  }

  new_buttons.innerHTML = new_buttons_html;

  var inputsDiv = document.getElementById('inputs');
  inputsDiv.appendChild(new_buttons);

  socket.emit('data', { config: input_config }); // * updating with empty button config
}
