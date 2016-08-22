/* eslint-disable no-loop-func */
import React, { Component, PropTypes } from 'react';
import { BufferLoader } from '../utils/buffer-loader';
import WebAudioScheduler from 'web-audio-scheduler';
import parser from 'note-parser';
import Envelope from 'envelope-generator';

import './song.css';

export default class Song extends Component {
  constructor(props) {
    super(props);
    this.init = this.init.bind(this);
    this.buffersLoaded = this.buffersLoaded.bind(this);
    this.loop = this.loop.bind(this);
    this.playSample = this.playSample.bind(this);
    this.playSynth = this.playSynth.bind(this);
    this.setupVisualization = this.setupVisualization.bind(this);
    this.createOscillator = this.createOscillator.bind(this);
    this.playToggle = this.playToggle.bind(this);
    this.state = {
      playing: this.props.autoplay === true,
    };
  }
  componentDidMount() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new AudioContext();

    this.ctx = this.canvas.getContext('2d');

    this.setupVisualization();

    const { tempo, children: seqChildren } = this.props;

    const beatInterval = 60000 / tempo;

    this.barInterval = beatInterval * 4;

    const sequencers = React.Children.toArray(seqChildren);

    this.sequencers = [];

    this.maxBars = 1;

    sequencers.forEach((seq) => {
      const { bars, resolution, children } = seq.props;

      if (bars > this.maxBars) {
        this.maxBars = bars;
      }

      const stepInterval = this.barInterval / resolution;
      const instruments = React.Children.toArray(children);
      this.sequencers.push({
        bars,
        stepInterval,
        instruments,
      });
    });

    this.init();
  }
  setupVisualization() {
    this.visualization = this.context.createScriptProcessor(2048, 1, 1);
    this.visualization.connect(this.context.destination);

    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 128;
    this.analyser.connect(this.context.destination);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(1, '#000000');
    gradient.addColorStop(0.75, '#2ecc71');
    gradient.addColorStop(0.25, '#f1c40f');
    gradient.addColorStop(0, '#e74c3c');

    this.visualization.onaudioprocess = () => {
      const array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);
      this.ctx.clearRect(0, 0, 800, 512);
      this.ctx.fillStyle = gradient;
      this.drawSpectrum(array);
    };
  }
  drawSpectrum(array) {
    for (let i = 0; i < (array.length); i++) {
      const value = array[i];
      this.ctx.fillRect(i * 12, 512, 10, value * -2);
    }
  }
  init() {
    this.scheduler = new WebAudioScheduler({
      context: this.context,
    });

    const sounds = [];

    this.sequencers.forEach((seq) => {
      seq.instruments.forEach((inst) => {
        if (inst.type.displayName === 'Sampler') {
          sounds.push(inst.props.sample);
        }
      });
    });

    if (sounds.length) {
      const bufferLoader = new BufferLoader(
        this.context,
        sounds,
        this.buffersLoaded
      );

      bufferLoader.load();
    } else {
      if (this.props.autoplay) {
        this.scheduler.start(this.loop);
      }
    }
  }
  buffersLoaded(bufferList) {
    this.bufferList = bufferList;
    if (this.props.autoplay) {
      this.scheduler.start(this.loop);
    }
  }
  playSample(e) {
    const source = this.context.createBufferSource();
    source.buffer = e.args.buffer;
    source.detune.value = e.args.detune;
    source.connect(e.args.connectNode);
    source.start(e.playbackTime);
    this.scheduler.nextTick(e.playbackTime + e.args.buffer.duration, () => {
      source.disconnect();
      e.args.connectNode.disconnect();
      e.args.gainNode.disconnect();
    });
  }
  playSynth(e) {
    const { props, note, duration } = e.args;
    if (Array.isArray(note)) {
      note.forEach((n) => {
        this.createOscillator({
          note: n,
          type: props.type,
          connectNode: e.args.connectNode,
          gainNode: e.args.gainNode,
          envelope: props.envelope,
          playbackTime: e.playbackTime,
          duration,
          stepInterval: e.args.stepInterval,
        });
      });
    } else {
      this.createOscillator({
        note,
        type: props.type,
        connectNode: e.args.connectNode,
        gainNode: e.args.gainNode,
        envelope: props.envelope,
        playbackTime: e.playbackTime,
        duration,
        stepInterval: e.args.stepInterval,
      });
    }
  }
  createOscillator(options) {
    const { note, type, connectNode, gainNode, envelope, playbackTime, duration } = options;

    const env = new Envelope(this.context, {
      curve: 'exponential',
      attackCurve: 'exponential',
      decayCurve: 'exponential',
      releaseCurve: 'exponential',
      attackTime: envelope.attack,
      decayTime: envelope.decay,
      sustainLevel: envelope.sustain,
      releaseTime: envelope.release,
    });
    env.connect(gainNode);

    const oscillator = this.context.createOscillator();
    oscillator.frequency.value = parser.freq(note);
    oscillator.type = type;
    oscillator.connect(connectNode);

    oscillator.start(playbackTime);
    env.start(playbackTime);

    env.release(this.context.currentTime + duration);
    const stopAt = env.getReleaseCompleteTime();

    env.stop(stopAt);
    oscillator.stop(stopAt);

    this.scheduler.nextTick(stopAt, () => {
      oscillator.disconnect();
      gainNode.disconnect();
      connectNode.disconnect();
    });
  }
  loop(e) {
    let sampleIndex = 0;
    this.sequencers.forEach((seq) => {
      const loopCount = this.maxBars / seq.bars;
      seq.instruments.forEach((inst) => {
        for (let i = 0; i < loopCount; i++) {
          const barOffset = ((this.barInterval * seq.bars) * i) / 1000;
          inst.props.steps.forEach((step, stepIndex) => {
            let gainNode;

            const compressorNode = this.context.createDynamicsCompressor();
            for (const param of Object.keys(inst.props.compressor)) {
              compressorNode[param].value = inst.props.compressor[param];
            }

            if (Array.isArray(inst.props.volume)) {
              gainNode = this.context.createGain();
              gainNode.gain.value = inst.props.volume[stepIndex] / 100;
              gainNode.connect(this.analyser);
              compressorNode.connect(gainNode);
            } else {
              gainNode = this.context.createGain();
              gainNode.gain.value = inst.props.volume / 100;
              gainNode.connect(this.analyser);
              compressorNode.connect(gainNode);
            }

            if (inst.type.displayName === 'Sampler') {
              const time = barOffset + ((step * seq.stepInterval) / 1000);
              this.scheduler.insert(e.playbackTime + time, this.playSample, {
                buffer: this.bufferList[sampleIndex],
                connectNode: compressorNode,
                gainNode,
                envelope: inst.props.envelope,
                detune: inst.props.detune,
                stepInterval: seq.stepInterval,
              });
            } else {
              const time = barOffset + ((step[0] * seq.stepInterval) / 1000);
              this.scheduler.insert(e.playbackTime + time, this.playSynth, {
                connectNode: compressorNode,
                gainNode,
                props: inst.props,
                duration: (step[1] * seq.stepInterval) / 1000,
                note: step[2],
                stepInterval: seq.stepInterval,
              });
            }
          });
        }

        if (inst.type.displayName === 'Sampler') {
          sampleIndex++;
        }
      });
    });

    this.scheduler.insert(e.playbackTime + ((this.barInterval * this.maxBars) / 1000), this.loop);
  }
  playToggle() {
    if (this.state.playing) {
      this.scheduler.stop(true);
    } else {
      this.scheduler.start(this.loop);
    }
    this.setState({
      playing: this.state.playing !== true
    });
  }
  render() {
    return (
      <div>
        <canvas
          className="react-music-canvas"
          width={800}
          height={512}
          ref={(c) => { this.canvas = c; }}
        />;
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

Song.propTypes = {
  tempo: PropTypes.number,
  autoplay: PropTypes.bool,
  children: PropTypes.node,
};

Song.defaultProps = {
  tempo: 90,
  autoplay: true,
};
