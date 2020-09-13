const robot = require('robotjs');
const five = require('johnny-five');
const rotaryEncoder = require('./encoder');

var board = new five.Board();

process.on('message', (message) => {

  // on Arduino Board ready
  board.on('ready', function() {

    message.button.forEach(btn_cfg => {
      var input_pin  = parseInt(btn_cfg.pin); // Pin needs to be an integer
      var output_key = btn_cfg.key;

      var btn = new five.Button({
        pin: input_pin,
        isPullup: true
      });

      btn.on("down", function() {
        robot.keyTap(output_key)
      });
    });

    message.encoder.forEach(enc_cfg => {
      const upButton = new five.Button(parseInt(enc_cfg.pin1));
      const downButton = new five.Button(parseInt(enc_cfg.pin2));

      rotaryEncoder({
        upButton,
        downButton,
        onUp: () => {
          robot.keyTap(enc_cfg.key1);
        },
        onDown: () => {
          robot.keyTap(enc_cfg.key2);
        },
      });
    })

  });

  board.on('exit', function() {
    process.send({connected : false});
  });

  board.on('close', function() {
    process.send({connected : false});
  });

});
