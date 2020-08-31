const robot = require('robotjs');
const five = require('johnny-five');
var board = new five.Board();

process.on('message', (message) => {
  if (message == 'START') {

    console.log('Child process received START message');
    process.send("Received START message...");

  } else {
    // message will be our board config
    process.send("Creating board config...");

    // on Arduino Board ready
    board.on('ready', function() {

      var led_pin    = 13; // Arduino board LED
      var led = new five.Led(led_pin);

      message.button.forEach(btn_cfg => {

        var input_pin  = parseInt(btn_cfg.pin); // Pin needs to be an integer
        var output_key = btn_cfg.key;

        var btn = new five.Button({
          pin: input_pin,
          isPullup: true
        });

        btn.on("down", function() {
          led.on();
          robot.keyTap(output_key)
        });

        btn.on("up", function() {
          led.off();
        })
      });

    });

    board.on('exit', function() {
      console.log('exit.');
      process.send({connected : false});
    });

    board.on('close', function() {
      console.log('close.');
      process.send({connected : false});
    });

  }

});
