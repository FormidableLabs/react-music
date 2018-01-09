// @flow
/* eslint-disable no-loop-func, react/no-did-mount-set-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Scheduler from '../utils/scheduler';

type Props = {
  children?: any;
  playing?: boolean;
  tempo: number;
};

export default class Song extends Component {
  audioContext: Object;
  barInterval: number;
  bars: Object;
  bufferLoaded: Function;
  buffers: Object;
  busses: Object;
  getMaster: Function;
  getMaxBars: Function;
  instruments: Object;
  loop: Function;
  props: Props;
  scheduler: Object;
  state: Object;
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
  constructor(props: Props) {
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
  getChildContext(): Object {
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
  componentWillReceiveProps(nextProps: Props) {
    this.barInterval = (60000 / nextProps.tempo) * 4;
  }
  componentDidUpdate(prevProps: Object, prevState: Object) {
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
  componentWillUnmount() {
    this.audioContext.close();
  }
  getMaster(): Object {
    return this;
  }
  getMaxBars(): number {
    return Math.max(...Object.keys(this.bars).map((b) => this.bars[b]));
  }
  bufferLoaded() {
    if (Object.keys(this.buffers).length === 0) {
      this.setState({
        buffersLoaded: true,
      });
    }
  }
  loop(e: Object) {
    const maxBars = Object.keys(this.bars).length ? this.getMaxBars() : 1;
    Object.keys(this.instruments).forEach((id) => {
      const callback = this.instruments[id];
      callback(e.playbackTime);
    });
    this.scheduler.insert(e.playbackTime + ((this.barInterval * maxBars) / 1000), this.loop);
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
