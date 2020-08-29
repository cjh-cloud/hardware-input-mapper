const robot = require('robotjs');
const five = require('johnny-five');
var board = new five.Board();

process.on('message', (message) => {
  if (message == 'START') {
    console.log('Child process received START message');
    process.send("Connecting to board...");
  }
})

// on Arduino Board ready
board.on('ready', function() {
  var output_key = "audio_pause";
  var input_pin  = 2;
  var led_pin    = 13; // Arduino board LED

  var led = new five.Led(led_pin);

  button = new five.Button({
    pin: input_pin, // Want to replace this with user defined var
    isPullup: true
  });

  button.on("down", function(value) {
    led.on();
    robot.keyTap(output_key)
  });

  button.on("up", function() {
    led.off();
  });

});

board.on('exit', function() {
  console.log('exit.');
});

board.on('close', function() {
  console.log('close.');
});