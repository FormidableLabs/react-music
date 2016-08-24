/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Delay extends Component {
  static propTypes = {
    children: PropTypes.node,
    feedback: PropTypes.number,
    delayTime: PropTypes.number,
    wetLevel: PropTypes.number,
    dryLevel: PropTypes.number,
    cutoff: PropTypes.number,
    bypass: PropTypes.number,
  };
  static defaultProps = {
    feedback: 0.45,
    delayTime: 150,
    wetLevel: 0.25,
    dryLevel: 1,
    cutoff: 2000,
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

    this.connectNode = new tuna.Delay({
      feedback: props.feedback,
      delayTime: props.delayTime,
      wetLevel: props.wetLevel,
      dryLevel: props.dryLevel,
      cutoff: props.cutoff,
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
