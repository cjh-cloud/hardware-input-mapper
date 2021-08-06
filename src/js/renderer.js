const socket = io.connect('http://localhost:' + 3000);

let input_config;
let is_config_loaded = false;

// Receive initial config from backend
socket.on('config', (data) => {
  input_config = data;

  // TODO : Check if this is needed
  if (!is_config_loaded) {
    for (input_type in input_config) {

      let new_input_div = loadInput(input_type);

      let inputsDiv = document.getElementById(`${input_type}_inputs`);
      inputsDiv.appendChild(new_input_div);
    }
    is_config_loaded = true;
  }
});

// Update config JSON
function change(input_name) {
  console.log(document.getElementById(input_name).value);

  let input_name_elements = input_name.split("_"); // e.g. pin_0 -> [pin, 0]
  let type = input_name_elements[0]; // e.g. button
  let name = input_name_elements[1]; // e.g. pin
  let index = input_name_elements[2]; // e.g. 0

  input_config[type][index][name] = document.getElementById(input_name).value;

  // send new input_config to server via socketio
  socket.emit('data', { config: input_config });
}

function getKeys() {
  let keys = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    '1','2','3','4','5','6','7','8','9','0',
    'backspace',
    'delete',
    'enter',
    'tab',
    'escape',
    'up','down','right','left',
    'home','end','pageup','pagedown',
    'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12',
    'command',
    'alt',
    'contorl',
    'shift',
    'right_shift',
    'space',
    'printscreen', // No Mac
    'insert', // No Mac
    'audio_mute','audio_vol_down','audio_vol_up','audio_play',
    'audio_stop','audio_pause','audio_prev','audio_next',
    'audio_rewind','audio_forward','audio_repeat','audio_random', // Linux Only
    // 'numpad_0','numpad_1','numpad_2','numpad_3','numpad_4','numpad_5','numpad_6','numpad_7','numpad_8','numpad_9', // No Linux
    // 'lights_mon_up,'lights_mon_down','lights_kbd_toggle','lights_kbd_up','lights_kbd_down', // No Win
  ]
  return keys;
}

// Build options for select tag - set selected based on config JSON
function getKeyOptions(value) {
  let options = '';
  getKeys().forEach(element => {
    options += `<option value="${element}"`;
    if( value == element ) {
      options += `selected="selected"`;
    }
    options += `>${element}`;
  });

  return options;
}

function addInputIcon(input_type, index) {
  let icon_html;
  if (input_type == 'button') {
    icon_html = `
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8"/>
    </svg>
    </span></div>
    <input type='text' class='form-control' placeholder='pin' id='${input_type}_pin_${index}' name='${input_type}_pin_${index}' onchange='change(this.name)' value='${input_config[input_type][index].pin}'>
    <select name='${input_type}_key_${index}' id='${input_type}_key_${index}' onchange='change(this.name)'>
    ${getKeyOptions(input_config[input_type][index].key)}
    </select>
    `;
  } else if (input_type == 'encoder') {
    icon_html = `
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>
    </span></div>
    <input type='text' class='form-control' placeholder='pin' id='${input_type}_pin1_${index}' name='${input_type}_pin1_${index}' onchange='change(this.name)' value='${input_config[input_type][index].pin1}'>
    <select name='${input_type}_key1_${index}' id='${input_type}_key1_${index}' onchange='change(this.name)'>
    ${getKeyOptions(input_config[input_type][index].key1)}
    </select>
    <input type='text' class='form-control' placeholder='pin' id='${input_type}_pin2_${index}' name='${input_type}_pin2_${index}' onchange='change(this.name)' value='${input_config[input_type][index].pin2}'>
    <select name='${input_type}_key2_${index}' id='${input_type}_key2_${index}' onchange='change(this.name)'>
    ${getKeyOptions(input_config[input_type][index].key2)}
    </select>
    `;
  }
  return icon_html;
}

function buildHtml(input_type, index) {
  return `<div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">
  ${addInputIcon(input_type, index)}
  <div class="input-group-append">
  <button type='${input_type}' class='btn input-group-text' name='${input_type}_${index}' onclick='delInput("${input_type}", this.name)'>
  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
  </button>
  </div>
  </div>`;
}

// Add new button config elements
function addInput(input_type) {
  let inputsDiv = document.getElementById(`${input_type}s`);
  let index = input_config[input_type].length;

  // TODO : Add input type here
  if (input_type == 'button') {
    input_config[input_type].push({pin: '', key: ''});
  } else if (input_type == 'encoder') {
    input_config[input_type].push({pin1: '', key1: '', pin2: '', key2: ''});
  }

  let new_input_cfg = document.createElement('div');
  new_input_cfg.id = `${input_type}_${index}`;
  new_input_cfg.innerHTML = buildHtml(input_type, index);

  inputsDiv.appendChild(new_input_cfg);

  socket.emit('data', { config: input_config }); // * updating with empty button config
}

function delInput(input_type, input_id) {
  let index = input_id.split("_")[1]; // e.g. button_0, gets 0
  input_config[input_type].splice(index, 1); // e.g. input_config.button.splice

  // Remove the entire buttons div
  let input_div = document.querySelector(`#${input_type}s`);
  input_div.parentNode.removeChild(input_div); // Get the div from its parent i.e. remove itself

  // Create new buttons div and recreate button configs
  new_input_div = document.createElement('div')
  new_input_div.id = `${input_type}s`;

  let new_input_div_html = '';

  for (let i=0; i<input_config[input_type].length; i++) {
    new_input_div_html += `<div id='${input_type}_${i}'>${buildHtml(input_type, i)}</div>`
  }

  new_input_div.innerHTML = new_input_div_html;

  let inputsDiv = document.getElementById(`${input_type}_inputs`);
  inputsDiv.appendChild(new_input_div);

  socket.emit('data', { config: input_config }); // * updating with empty button config
}

function loadInput(input_type) {

  // Create new buttons div and recreate button configs
  new_input_div = document.createElement('div')
  new_input_div.id = `${input_type}s`;

  let new_input_div_html = '';

  for (let i=0; i<input_config[input_type].length; i++) {
    new_input_div_html += `<div id='${input_type}_${i}'>${buildHtml(input_type, i)}</div>`
  }

  new_input_div.innerHTML = new_input_div_html;

  return new_input_div;

}
