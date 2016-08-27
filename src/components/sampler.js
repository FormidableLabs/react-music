// @flow
import React, { PropTypes, Component } from 'react';
import uuid from 'uuid';

import { BufferLoader } from '../utils/buffer-loader';

type Props = {
  busses: Array<string>;
  children?: any;
  detune?: number;
  gain?: number;
  sample: string;
  steps: Array<any>;
};

type Context = {
  audioContext: Object;
  bars: number;
  barInterval: number;
  bufferLoaded: Function;
  connectNode: Object;
  getMaster: Function;
  resolution: number;
  scheduler: Object;
  tempo: number;
};

export default class Sampler extends Component {
  buffer: Object;
  bufferLoaded: Function;
  connectNode: Object;
  context: Context;
  id: String;
  getSteps: Function;
  playStep: Function;
  props: Props;
  static displayName = 'Sampler';
  static propTypes = {
    busses: PropTypes.array,
    children: PropTypes.node,
    detune: PropTypes.number,
    gain: PropTypes.number,
    sample: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
  };
  static defaultProps = {
    detune: 0,
    gain: 0.5,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    bufferLoaded: PropTypes.func,
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
    bufferLoaded: PropTypes.func,
    connectNode: PropTypes.object,
    getMaster: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
  };
  constructor(props: Props, context: Context) {
    super(props);

    this.bufferLoaded = this.bufferLoaded.bind(this);
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
    master.buffers[this.id] = 1;

    const bufferLoader = new BufferLoader(
      this.context.audioContext,
      [this.props.sample],
      this.bufferLoaded
    );

    bufferLoader.load();
  }
  componentWillReceiveProps(nextProps: Props) {
    this.connectNode.gain.value = nextProps.gain;
    if (this.props.sample !== nextProps.sample) {
      const master = this.context.getMaster();
      delete master.buffers[this.id];

      this.id = uuid.v1();
      master.buffers[this.id] = 1;

      const bufferLoader = new BufferLoader(
        this.context.audioContext,
        [nextProps.sample ],
        this.bufferLoaded
      );

      bufferLoader.load();
    }
  }
  componentWillUnmount() {
    const master = this.context.getMaster();

    delete master.buffers[this.id];
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
        const stepValue = Array.isArray(step) ? step[0] : step;
        const time = barOffset + ((stepValue * stepInterval) / 1000);

        this.context.scheduler.insert(playbackTime + time, this.playStep, {
          time: playbackTime,
          step,
        });
      });
    }
  }
  playStep(e: Object) {
    const source = this.context.audioContext.createBufferSource();
    source.buffer = this.buffer;
    if (source.detune) {
      if (Array.isArray(e.args.step)) {
        source.detune.value = (this.props.detune + e.args.step[1]) * 100;
      } else {
        source.detune.value = this.props.detune;
      }
    }
    source.connect(this.connectNode);

    if (this.props.busses) {
      const master = this.context.getMaster();
      this.props.busses.forEach((bus) => {
        if (master.busses[bus]) {
          source.connect(master.busses[bus]);
        }
      });
    }

    source.start(e.args.playbackTime);
    this.context.scheduler.nextTick(e.args.playbackTime + this.buffer.duration, () => {
      source.disconnect();
    });
  }
  bufferLoaded(buffers: Array<Object>) {
    this.buffer = buffers[0];
    const master = this.context.getMaster();
    delete master.buffers[this.id];
    this.context.bufferLoaded();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
