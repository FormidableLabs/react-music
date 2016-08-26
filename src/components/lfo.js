// @flow
import React, { PropTypes, Component } from 'react';

type Props = {
  children?: any;
  connect: Function;
  frequency?: number;
  gain?: number;
  type?: string;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class LFO extends Component {
  connectNode: Object;
  context: Context;
  osc: Object;
  props: Props;
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
    this.connectNode.disconnect();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}

