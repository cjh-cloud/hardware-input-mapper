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

function addInputIcon(input_type) {
  var icon_html;
  if (input_type == 'button') {
    icon_html = `
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8"/>
    </svg>
    `
  }
  return icon_html;
}

function buildHtml(input_type, index) {
  var thing = '';
  thing += '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">';
  // add button icon
  thing += addInputIcon(input_type);
  thing += '</span></div>';
  thing += `<input type='text' class='form-control' placeholder='pin' id='${input_type}_pin_${index}' name='${input_type}_pin_${index}' onchange='change(this.name)' value='${input_config[input_type][index].pin}'>
            <input type='text' class='form-control' placeholder='key' id='${input_type}_key_${index}' name='${input_type}_key_${index}' onchange='change(this.name)' value='${input_config[input_type][index].key}'>`;
  thing += '<div class="input-group-append">';
  thing += `<button type='${input_type}' class='btn input-group-text' name='${input_type}_${index}' onclick='delInput("${input_type}", this.name)'>`;
  // add trash svg
  thing += `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
  </button>
  </div>
  </div>`
  return thing;
}

// Add new button config elements
function addInput(input_type) {
  var inputsDiv = document.getElementById(`${input_type}s`);
  var index = input_config.button.length;

  input_config[input_type].push({pin: '', key: ''});

  var new_input_cfg = document.createElement('div');
  new_input_cfg.id = `${input_type}_${index}`;
  new_input_cfg.innerHTML = buildHtml(input_type, index);

  inputsDiv.appendChild(new_input_cfg);

  socket.emit('data', { config: input_config }); // * updating with empty button config
}

function delInput(input_type, input_id) {
  var index = input_id.split("_")[1]; // e.g. button_0, gets 0
  input_config[input_type].splice(index, 1); // e.g. input_config.button.splice

  // Remove the entire buttons div
  var input_div = document.querySelector(`#${input_type}s`);
  input_div.parentNode.removeChild(input_div); // Get the div from its parent i.e. remove itself

  // Create new buttons div and recreate button configs
  new_input_div = document.createElement('div')
  new_input_div.id = `${input_type}s`;

  var new_input_div_html = '';

  for (var i=0; i<input_config.button.length; i++) {
    new_input_div_html += `<div id='${input_type}_${i}'>${buildHtml(input_type, i)}</div>`
    //  class='${input_type}'
  }

  new_input_div.innerHTML = new_input_div_html;

  var inputsDiv = document.getElementById(`${input_type}_inputs`);
  inputsDiv.appendChild(new_input_div);

  socket.emit('data', { config: input_config }); // * updating with empty button config
}
