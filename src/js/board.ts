const robot = require('robotjs');
const five = require('johnny-five');
const rotaryEncoder = require('./encoder');

let board = new five.Board();

// This is to describe a JSON payload lol - Feel like message needs an interface and class
interface Message {
  button?: Button[]
  encoder?: Encoder[]
}

interface Button {
  pin: string
  key: string
}

interface Encoder {
  pin1: string
  pin2: string
  key1: string
  key2: string
}

process.on('message', (message: Message) => {

  // on Arduino Board ready
  board.on('ready', function() {

    if (message.button) {
      message.button.forEach(btn_cfg => {
        let input_pin  = parseInt(btn_cfg.pin); // Pin needs to be an integer
        let output_key = btn_cfg.key;

        let btn = new five.Button({
          pin: input_pin,
          isPullup: true
        });

        btn.on("down", function() {
          robot.keyTap(output_key)
        });
      });
    }

    if (message.encoder) {
      message.encoder.forEach(enc_cfg => {
        const upButton = new five.Button(parseInt(enc_cfg.pin1));
        const downButton = new five.Button(parseInt(enc_cfg.pin2));

        const onUp = () => {
          robot.keyTap(enc_cfg.key1);
        }

        const onDown = () => {
          robot.keyTap(enc_cfg.key2);
        }

        rotaryEncoder(
          upButton,
          downButton,
          onUp,
          onDown,
        );
      })
    }

  });

  board.on('exit', function() {
    if (process.send)
      process.send({connected : false});
  });

  board.on('close', function() {
    if (process.send)
      process.send({connected : false});
  });

});
