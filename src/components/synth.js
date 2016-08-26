// @flow
/* eslint-disable max-statements */
import React, { PropTypes, Component } from 'react';
import parser from 'note-parser';
import contour from 'audio-contour';
import uuid from 'uuid';

export default class Synth extends Component {
  connectNode: Object;
  getSteps: Function;
  id: string;
  playStep: Function;
  static displayName = 'Synth';
  static propTypes = {
    busses: PropTypes.array,
    children: PropTypes.node,
    envelope: PropTypes.shape({
      attack: PropTypes.number,
      decay: PropTypes.number,
      sustain: PropTypes.number,
      release: PropTypes.number,
    }),
    gain: PropTypes.number,
    steps: PropTypes.array.isRequired,
    transpose: PropTypes.number,
    type: PropTypes.string.isRequired,
  };
  static defaultProps = {
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.2,
      release: 0.2,
    },
    gain: 0.5,
    transpose: 0,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    connectNode: PropTypes.object,
    getMaster: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    connectNode: PropTypes.object,
    getMaster: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
  };
  constructor(props: Object, context: Object) {
    super(props);

    this.getSteps = this.getSteps.bind(this);
    this.playStep = this.playStep.bind(this);

    this.connectNode = context.audioContext.createGain();
    this.connectNode.gain.value = props.gain;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    this.id = uuid.v1();
    const master = this.context.getMaster();
    master.instruments[this.id] = this.getSteps;
  }
  componentWillReceiveProps(nextProps: Object) {
    this.connectNode.gain.value = nextProps.gain;
  }
  componentWillUnmount() {
    const master = this.context.getMaster();
    delete master.instruments[this.id];
    this.connectNode.disconnect();
  }
  getSteps(playbackTime: number) {
    const totalBars = this.context.getMaster().getMaxBars();
    const loopCount = totalBars / this.context.bars;
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
  createOscillator(time: number, note: string, duration: number) {
    const amplitudeGain = this.context.audioContext.createGain();
    amplitudeGain.gain.value = 0;
    amplitudeGain.connect(this.connectNode);

    const env = contour(this.context.audioContext, {
      attack: this.props.envelope.attack,
      decay: this.props.envelope.decay,
      sustain: this.props.envelope.sustain,
      release: this.props.envelope.release,
    });

    env.connect(amplitudeGain.gain);

    const osc = this.context.audioContext.createOscillator();
    const transposed = note.slice(0, -1) +
      (parseInt(note[note.length - 1], 0) + parseInt(this.props.transpose, 0));

    osc.frequency.value = parser.freq(transposed);
    osc.type = this.props.type;
    osc.connect(amplitudeGain);

    if (this.props.busses) {
      const master = this.context.getMaster();
      this.props.busses.forEach((bus) => {
        if (master.busses[bus]) {
          osc.connect(master.busses[bus]);
        }
      });
    }

    osc.start(time);
    env.start(time);

    const finish = env.stop(this.context.audioContext.currentTime + duration);
    osc.stop(finish);
  }
  playStep(e: Object) {
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
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}

