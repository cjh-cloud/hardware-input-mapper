// var five = require('johnny-five');

export function rotaryEncoder(
  upButton: any,
  downButton: any,
  onUp: any,
  onDown: any,
) {
  let waveform = '';
  let waveformTimeout: NodeJS.Timeout; // ReturnType<typeof setTimeout>;

  upButton.on('up', () => {
    waveform += '1';
    handleWaveform();
  });

  downButton.on('up', () => {
    waveform += '0';
    handleWaveform();
  });

  function handleWaveform() {
    if (waveform.length < 2) {
      waveformTimeout = setTimeout(() => {
        waveform = '';
      }, 8);
      return;
    }

    if (waveformTimeout) {
      clearTimeout(waveformTimeout);
    }

    if (waveform === '01') {
      onUp();
    } else if (waveform === '10') {
      onDown();
    }

    waveform = '';
  }
}