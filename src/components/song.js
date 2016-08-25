/* eslint-disable no-loop-func, react/no-did-mount-set-state */
import React, { Component, PropTypes, } from 'react';
import Scheduler from '../utils/scheduler';

export default class Song extends Component {
  static propTypes = {
    children: PropTypes.node,
    playing: PropTypes.bool,
    tempo: PropTypes.number,
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
    getMaster: PropTypes.func,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
  };
  constructor(props) {
    super(props);

    this.state = {
      buffersLoaded: false,
    };

    this.barInterval = (60000 / props.tempo) * 4;
    this.bars = {};
    this.buffers = {};
    this.instruments = {};
    this.busses = {};

    this.loop = this.loop.bind(this);
    this.bufferLoaded = this.bufferLoaded.bind(this);
    this.getMaster = this.getMaster.bind(this);
    this.getMaxBars = this.getMaxBars.bind(this);

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
      getMaster: this.getMaster,
      scheduler: this.scheduler,
    };
  }
  componentDidMount() {
    if (Object.keys(this.buffers).length === 0) {
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
  getMaster() {
    return this;
  }
  getMaxBars() {
    return Math.max(...Object.keys(this.bars).map((b) => this.bars[b]));
  }
  bufferLoaded() {
    if (Object.keys(this.buffers).length === 0) {
      this.setState({
        buffersLoaded: true,
      });
    }
  }
  loop(e) {
    const maxBars = Object.keys(this.bars).length ? this.getMaxBars() : 1;
    Object.keys(this.instruments).forEach((id) => {
      const callback = this.instruments[id];
      callback(e.playbackTime);
    });
    this.scheduler.insert(e.playbackTime + ((this.barInterval * maxBars) / 1000), this.loop);
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
