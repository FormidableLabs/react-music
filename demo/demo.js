import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
} from '../src';

import Polysynth from './polysynth';
import Visualization from './visualization';

import './index.css';

export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
  }
  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }
  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }
  render() {
    return (
      <div>
        <Song
          playing={this.state.playing}
          tempo={90}
        >
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={1}
            >
              <Sampler
                sample="samples/kick.wav"
                steps={[0, 2, 8, 10]}
              />
              <Sampler
                sample="samples/snare.wav"
                steps={[4, 12]}
              />
            </Sequencer>
            <Sequencer
              resolution={16}
              bars={2}
            >
              <Polysynth
                type="sine"
                steps={[
                  [0, 1, ['c3', 'd#3', 'g3' ]],
                  [2, 1, ['c4']],
                  [8, 1, ['c3', 'd#3', 'g3']],
                  [10, 1, ['c4']],
                  [12, 1, ['c3', 'd#3', 'g3']],
                  [14, 1, ['d#4']],
                  [16, 1, ['f3', 'g#3', 'c4']],
                  [18, 1, ['f3', 'g#3', 'c4']],
                  [24, 1, ['f3', 'g#3', 'c4']],
                  [26, 1, ['f3', 'g#3', 'c4']],
                  [28, 1, ['f3', 'g#3', 'c4']],
                  [30, 1, ['f3', 'g#3', 'c4']],
                ]}
              />
            </Sequencer>
            <Sequencer
              resolution={16}
              bars={2}
            >
              <Synth
                type="sine"
                steps={[
                  [0, 8, 'c2'],
                  [8, 4, 'c2'],
                  [12, 4, 'd#2'],
                  [16, 8, 'f2'],
                  [24, 8, 'f1'],
                ]}
              />
            </Sequencer>
          </Analyser>
        </Song>

        <Visualization ref={(c) => { this.visualization = c; }} />

        <button
          className="react-music-button"
          type="button"
          onClick={this.handlePlayToggle}
        >
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
      </div>
    );
  }
}
