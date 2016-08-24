/* eslint-disable no-loop-func, react/no-did-mount-set-state */
import React, { Component, PropTypes } from 'react';
import Scheduler from '../utils/scheduler';

export default class Song extends Component {
  static propTypes = {
    playing: PropTypes.bool,
    tempo: PropTypes.number,
    children: PropTypes.node,
  };
  static defaultProps = {
    playing: false,
    tempo: 90,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    barInterval: PropTypes.number,
    bufferLoaded: PropTypes.func,
    connectNode: PropTypes.object,
    registerBars: PropTypes.func,
    registerBuffer: PropTypes.func,
    registerInstrument: PropTypes.func,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
    totalBars: PropTypes.number,
  };
  constructor(props) {
    super(props);

    this.state = {
      buffersLoaded: false,
    };

    this.bufferCount = 0;
    this.bars = 1;
    this.barInterval = (60000 / props.tempo) * 4;
    this.instrumentCallbacks = [];

    this.loop = this.loop.bind(this);
    this.registerBars = this.registerBars.bind(this);
    this.registerBuffer = this.registerBuffer.bind(this);
    this.registerInstrument = this.registerInstrument.bind(this);
    this.bufferLoaded = this.bufferLoaded.bind(this);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.scheduler = new Scheduler({
      context: this.audioContext,
    });
  }
  getChildContext() {
    return {
      tempo: this.props.tempo,
      audioContext: this.audioContext,
      barInterval: this.barInterval,
      bufferLoaded: this.bufferLoaded,
      connectNode: this.audioContext.destination,
      registerBuffer: this.registerBuffer, // make dynamic
      registerBars: this.registerBars,
      registerInstrument: this.registerInstrument, // make dynamic
      scheduler: this.scheduler,
      totalBars: this.bars, // Make dynamic
    };
  }
  componentDidMount() {
    if (this.bufferCount === 0) {
      this.setState({
        buffersLoaded: true,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.buffersLoaded !== this.state.buffersLoaded ||
        prevProps.playing !== this.props.playing) {
      if (this.state.buffersLoaded === true && this.props.playing === true) {
        setTimeout(() => {
          this.scheduler.start(this.loop);
        }, 0);
      } else {
        this.scheduler.stop(true);
      }
    }
  }
  bufferLoaded() {
    this.bufferCount--;
    if (this.bufferCount === 0) {
      this.setState({
        buffersLoaded: true,
      });
    }
  }
  loop(e) {
    this.instrumentCallbacks.forEach((callback) => {
      callback(e.playbackTime);
    });
    this.scheduler.insert(e.playbackTime + ((this.barInterval * this.bars) / 1000), this.loop);
  }
  registerBars(bars) {
    if (bars > this.bars) {
      this.bars = bars;
    }
  }
  registerBuffer() {
    this.bufferCount++;
  }
  registerInstrument(callback) {
    this.instrumentCallbacks.push(callback);
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
