import React from 'react';
import ReactDOM from 'react-dom';
import { Song, Sequencer, Sampler, Synth } from '../src';

ReactDOM.render(
  <Song tempo={180}>
    <Sequencer resolution={16} bars={2}>
      <Sampler
        sample="/samples/kick.wav"
        steps={[0, 4, 14]}
      />
      <Sampler
        sample="/samples/snare.wav"
        steps={[8, 24]}
      />
    </Sequencer>
    <Sequencer resolution={16} bars={4}>
      <Sampler
        sample="/samples/hihat.wav"
        steps={[
          0, 4, 8, 12, 16, 20, 24, 28,
          32, 36, 40, 44, 48, 52, 56, 60,
        ]}
        volume={80}
      />
    </Sequencer>
    <Sequencer resolution={16} bars={8}>
      <Synth
        type="sawtooth"
        volume={15}
        envelope={{
          attack: 0.01,
          sustain: 0.2,
          decay: 0,
          release: 0.1,
        }}
        steps={[
          [0, 2, 'a#2'],
          [4, 2, 'a#2'],
          [8, 1, 'a#3'],
          [10, 1, 'a#3'],
          [12, 1, 'a#3'],
          [14, 1, 'a#3'],
          [16, 2, 'g#2'],
          [20, 2, 'g#2'],
          [24, 1, 'g#3'],
          [26, 1, 'g#3'],
          [28, 1, 'g#3'],
          [30, 1, 'g#3'],
          [32, 2, 'f#2'],
          [36, 2, 'f#2'],
          [40, 1, 'f#3'],
          [42, 1, 'f#3'],
          [44, 1, 'f#3'],
          [46, 1, 'f#3'],
          [48, 2, 'd#2'],
          [52, 2, 'd#2'],
          [56, 1, 'd#3'],
          [58, 1, 'd#3'],
          [60, 1, 'd#3'],
          [62, 1, 'd#3'],
          [64, 8, 'a#2'],
          [72, 8, 'a#3'],
          [80, 8, 'g#2'],
          [88, 8, 'g#3'],
          [96, 8, 'f#2'],
          [104, 8, 'f#3'],
          [112, 8, 'd#2'],
          [120, 8, 'd#3'],
        ]}
      />
    </Sequencer>
    <Sequencer resolution={16} bars={4}>
      <Synth
        type="sine"
        volume={40}
        envelope={{
          attack: 0.1,
          sustain: 0.5,
          decay: 0,
          release: 1,
        }}
        steps={[
          [0, 1, 'a#1'],
          [16, 1, 'g#1'],
          [32, 1, 'f#1'],
          [48, 1, 'd#1'],
        ]}
      />
    </Sequencer>
  </Song>,
  document.getElementById('root')
);
