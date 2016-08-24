import React, { PropTypes, Component } from 'react';
import parser from 'note-parser';
import contour from 'audio-contour';

export default class Synth extends Component {
  static displayName = 'Synth';
  static propTypes = {
    children: PropTypes.node,
    envelope: PropTypes.shape({
      attack: PropTypes.number,
      decay: PropTypes.number,
      sustain: PropTypes.number,
      release: PropTypes.number,
    }),
    gain: PropTypes.number,
    type: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
  };
  static defaultProps = {
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.2,
      release: 0.2,
    },
    gain: 0.5,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    bufferLoaded: PropTypes.func,
    connectNode: PropTypes.object,
    registerBuffer: PropTypes.func,
    registerInstrument: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
    totalBars: PropTypes.number,
  };
  constructor(props, context) {
    super(props);

    this.getSteps = this.getSteps.bind(this);
    this.playStep = this.playStep.bind(this);

    context.registerInstrument(this.getSteps);
  }
  getSteps(playbackTime) {
    const loopCount = this.context.totalBars / this.context.bars;
    for (let i = 0; i < loopCount; i++) {
      const barOffset = ((this.context.barInterval * this.context.bars) * i) / 1000;
      const stepInterval = this.context.barInterval / this.context.resolution;

      this.props.steps.forEach((step) => {
        const time = barOffset + ((step[0] * stepInterval) / 1000);

        this.context.scheduler.insert(playbackTime + time, this.playStep, {
          time: playbackTime,
          step,
        });
      });
    }
  }
  createOscillator(time, note, duration) {

    const gain = this.context.audioContext.createGain();
    gain.connect(this.context.connectNode);

    const env = contour(this.context.audioContext, {
      attack: this.props.envelope.attack,
      decay: this.props.envelope.decay,
      sustain: this.props.envelope.sustain,
      release: this.props.envelope.release,
    });
    env.connect(gain.gain);

    const osc = this.context.audioContext.createOscillator();
    osc.frequency.value = parser.freq(note);
    osc.type = this.props.type;
    osc.connect(gain);

    osc.start(time);
    env.start(time);

    const finish = env.stop(this.context.audioContext.currentTime + duration);
    osc.stop(finish);
  }
  playStep(e) {
    const { step, time } = e.args;
    const notes = step[2];
    const stepInterval = this.context.barInterval / this.context.resolution;
    const duration = (step[1] * stepInterval) / 1000;

    if (Array.isArray(notes)) {
      notes.forEach((n) => {
        this.createOscillator(time, n, duration);
      });
    } else {
      this.createOscillator(time, notes, duration);
    }
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}

