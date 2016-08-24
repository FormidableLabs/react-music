/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Reverb extends Component {
  static propTypes = {
    children: PropTypes.node,
    highCut: PropTypes.number,
    lowCut: PropTypes.number,
    dryLevel: PropTypes.number,
    wetLevel: PropTypes.number,
    level: PropTypes.number,
    impulse: PropTypes.string,
    bypass: PropTypes.number,
  };
  static defaultProps = {
    highCut: 22050,
    lowCut: 20,
    dryLevel: 1,
    wetLevel: 1,
    level: 1,
    impulse: 'reverb/room.wav',
    bypass: 0,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  constructor(props, context) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = new tuna.Convolver({
      highCut: props.highCut,
      lowCut: props.lowCut,
      dryLevel: props.dryLevel,
      wetLevel: props.wetLevel,
      level: props.level,
      impulse: props.impulse,
      bypass: props.bypass,
    });

    this.connectNode.connect(context.connectNode);
  }
  getChildContext() {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
