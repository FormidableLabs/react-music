// @flow
import React, { PropTypes, Component } from 'react';
import parser from 'note-parser';
import contour from 'audio-contour';
import uuid from 'uuid';

export default class Monosynth extends Component {
  amplitudeGain: Object;
  connectNode: Object;
  id: String;
  getSteps: Function;
  osc: Object;
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
    glide: PropTypes.number,
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
    glide: 0.1,
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

    this.amplitudeGain = this.context.audioContext.createGain();
    this.amplitudeGain.gain.value = 0;
    this.amplitudeGain.connect(this.connectNode);

    this.osc = this.context.audioContext.createOscillator();
    this.osc.type = this.props.type;
    this.osc.connect(this.amplitudeGain);

    if (this.props.busses) {
      this.props.busses.forEach((bus) => {
        if (master.busses[bus]) {
          this.osc.connect(master.busses[bus]);
        }
      });
    }

    this.osc.start(this.context.audioContext.currentTime);
  }
  componentWillUnmount() {
    const master = this.context.getMaster();
    delete master.instruments[this.id];
    this.osc.stop();
    this.connectNode.disconnect();
  }
  getSteps(playbackTime: number) {
    const totalBars = this.context.getMaster().getMaxBars();
    const loopCount = totalBars / this.context.bars;
    for (let i = 0; i < loopCount; i++) {
      const barOffset = ((this.context.barInterval * this.context.bars) * i) / 1000;
      const stepInterval = this.context.barInterval / this.context.resolution;
      this.props.steps.forEach((step, index) => {
        const time = barOffset + ((step[0] * stepInterval) / 1000);
        let glide = false;

        if (index !== 0) {
          const lastTime = barOffset + ((this.props.steps[index - 1][0] * stepInterval) / 1000);
          const lastDuration = (this.props.steps[index - 1][1] * stepInterval) / 1000;
          glide = lastTime + lastDuration > time;
        }

        this.context.scheduler.insert(playbackTime + time, this.playStep, {
          time: playbackTime,
          step,
          glide,
        });
      });
    }
  }
  createOscillator() {
    const [ time, note, duration, glide ] = arguments;
    const transposed = note.slice(0, -1) +
      (parseInt(note[note.length - 1], 0) + parseInt(this.props.transpose, 0));

    const env = contour(this.context.audioContext, {
      attack: this.props.envelope.attack,
      decay: this.props.envelope.decay,
      sustain: this.props.envelope.sustain,
      release: this.props.envelope.release,
    });

    env.connect(this.amplitudeGain.gain);
    this.osc.frequency.setTargetAtTime(
      parser.freq(transposed), time, glide ? this.props.glide : 0.001
    );

    env.start(time);
    env.stop(this.context.audioContext.currentTime + duration);
  }
  playStep(e: Object) {
    const { step, glide, time } = e.args;
    const note = step[2];
    const stepInterval = this.context.barInterval / this.context.resolution;
    const duration = (step[1] * stepInterval) / 1000;
    this.createOscillator(time, note, duration, glide);
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}

