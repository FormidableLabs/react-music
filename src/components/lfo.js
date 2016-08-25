import React, { PropTypes, Component, } from 'react';

export default class Synth extends Component {
  static displayName = 'Synth';
  static propTypes = {
    children: PropTypes.node,
    connect: PropTypes.func,
    frequency: PropTypes.number,
    gain: PropTypes.number,
    type: PropTypes.string,
  };
  static defaultProps = {
    connect: (node) => node.gain,
    frequency: 1,
    gain: 0.5,
    type: 'sine',
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  componentDidMount() {
    const volumeGain = this.context.audioContext.createGain();
    volumeGain.gain.value = this.props.gain;
    this.osc = this.context.audioContext.createOscillator();
    this.osc.frequency.value = this.props.frequency;
    this.osc.type = this.props.type;
    this.osc.connect(volumeGain);
    volumeGain.connect(this.props.connect(this.context.connectNode));

    this.osc.start(this.context.audioContext.currentTime);
  }
  componentWillUnmount() {
    this.osc.stop();
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}

