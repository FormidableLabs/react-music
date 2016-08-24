import React, { Component } from 'react';
import { Analyser, Compressor, Song, Sequencer, Sampler, Synth } from '../src';

import './index.css';

export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
    };

    this.audioProcess = this.audioProcess.bind(this);
    this.playToggle = this.playToggle.bind(this);
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
  }
  audioProcess(analyser) {
    if (this.ctx) {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(1, '#000000');
      gradient.addColorStop(0.75, '#2ecc71');
      gradient.addColorStop(0.25, '#f1c40f');
      gradient.addColorStop(0, '#e74c3c');

      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      this.ctx.clearRect(0, 0, 800, 512);
      this.ctx.fillStyle = gradient;

      for (let i = 0; i < (array.length); i++) {
        const value = array[i];
        this.ctx.fillRect(i * 12, 512, 10, value * -2);
      }
    }
  }
  playToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }
  render() {
    return (
      <div>
        <Song
          playing={this.state.playing}
          tempo={190}
        >
          <Analyser onAudioProcess={this.audioProcess}>
            <Sequencer
              resolution={16}
              bars={2}
            >
              <Compressor>
                <Sampler
                  sample="samples/kick.wav"
                  steps={[0, 4, 16]}
                />
                <Sampler
                  sample="samples/snare.wav"
                  steps={[8, 24]}
                />
                <Sampler
                  sample="samples/hihat.wav"
                  steps={[0, 4, 8, 12, 16, 20, 24, 28]}
                />
              </Compressor>
            </Sequencer>
            <Sequencer
              resolution={16}
              bars={4}
            >
              <Synth
                type="sine"
                gain={0}
                steps={[
                  [0, 1, ['d1']],
                  [4, 1, ['d1']],
                  [8, 1, ['f1']],
                  [12, 1, ['g1']],
                  [16, 1, ['a1']],
                  [20, 1, ['d1']],
                  [32, 1, ['d1']],
                  [33, 1, ['d1']],
                  [34, 1, ['d1']],
                  [40, 1, ['f1']],
                  [44, 1, ['f1']],
                  [48, 1, ['d1']],
                ]}
              />
            </Sequencer>
          </Analyser>
        </Song>

        <canvas
          className="react-music-canvas"
          width={800}
          height={512}
          ref={(c) => { this.canvas = c; }}
        />

        <button
          className="react-music-button"
          type="button"
          onClick={this.playToggle}
        >
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
      </div>
    );
  }
}
