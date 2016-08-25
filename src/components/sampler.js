import React, { PropTypes, Component, } from 'react';
import uuid from 'uuid';

import { BufferLoader, } from '../utils/buffer-loader';

export default class Sampler extends Component {
  static displayName = 'Sampler';
  static propTypes = {
    children: PropTypes.node,
    detune: PropTypes.number,
    sample: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
  };
  static defaultProps = {
    detune: 0,
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
  constructor(props) {
    super(props);

    this.buffer = null;
    this.bufferLoaded = this.bufferLoaded.bind(this);
    this.getSteps = this.getSteps.bind(this);
    this.playStep = this.playStep.bind(this);
  }
  componentDidMount() {
    this.id = uuid.v1();

    const master = this.context.getMaster();
    master.instruments[this.id] = this.getSteps;
    master.buffers[this.id] = 1;

    const bufferLoader = new BufferLoader(
      this.context.audioContext,
      [this.props.sample, ],
      this.bufferLoaded
    );

    bufferLoader.load();
  }
  componentWillUnmount() {
    const master = this.context.getMaster();

    delete master.buffers[this.id];
    delete master.instruments[this.id];
  }
  getSteps(playbackTime) {
    const totalBars = this.context.getMaster().getMaxBars();
    const loopCount = totalBars / this.context.bars;
    for (let i = 0; i < loopCount; i++) {
      const barOffset = ((this.context.barInterval * this.context.bars) * i) / 1000;
      const stepInterval = this.context.barInterval / this.context.resolution;

      this.props.steps.forEach((step) => {
        const time = barOffset + ((step * stepInterval) / 1000);

        this.context.scheduler.insert(playbackTime + time, this.playStep, {
          time: playbackTime,
        });
      });
    }
  }
  playStep(e) {
    const source = this.context.audioContext.createBufferSource();
    source.buffer = this.buffer;
    if (source.detune) {
      source.detune.value = this.props.detune;
    }
    source.connect(this.context.connectNode);
    source.start(e.args.playbackTime);
    this.context.scheduler.nextTick(e.args.playbackTime + this.buffer.duration, () => {
      source.disconnect();
    });
  }
  bufferLoaded([buffer, ]) {
    this.buffer = buffer;
    const master = this.context.getMaster();
    delete master.buffers[this.id];
    this.context.bufferLoaded();
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
