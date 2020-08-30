const robot = require('robotjs');
const five = require('johnny-five');
var board = new five.Board();

process.on('message', (message) => {
  if (message == 'START') {

    console.log('Child process received START message');
    process.send("Connecting to board...");

  } else {

    // message will be our board config

    // on Arduino Board ready
    board.on('ready', function() {

      var led_pin    = 13; // Arduino board LED
      var led = new five.Led(led_pin);

      for (btn_cfg in message.btn) {
        var input_pin  = btn_cfg.pin;
        var output_key = btn_cfg.key;

        var btn = new five.Button({
          pin: input_pin,
          isPullup: true
        });

        btn.on("down", function() {
          led.on();
          robot.keyTap(output_key)
        });

        button.on("up", function() {
          led.off();
        })
      }

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
