/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class PingPong extends Component {
  static propTypes = {
    children: PropTypes.node,
    wetLevel: PropTypes.number,
    feedback: PropTypes.number,
    delayTimeLeft: PropTypes.number,
    delayTimeRight: PropTypes.number,
  };
  static defaultProps = {
    wetLevel: 0.5,
    feedback: 0.3,
    delayTimeLeft: 150,
    delayTimeRight: 200,
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

    this.connectNode = new tuna.PingPongDelay({
      wetLevel: props.wetLevel,
      feedback: props.feedback,
      delayTimeLeft: props.delayTimeLeft,
      delayTimeRight: props.delayTimeRight,
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
