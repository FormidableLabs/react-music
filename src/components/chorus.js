/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Chorus extends Component {
  static propTypes = {
    children: PropTypes.node,
    rate: PropTypes.number,
    feedback: PropTypes.number,
    delay: PropTypes.number,
    bypass: PropTypes.number,
  };
  static defaultProps = {
    rate: 1.5,
    feedback: 0.2,
    delay: 0.0045,
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

    this.connectNode = new tuna.Chorus({
      feedback: props.feedback,
      rate: props.rate,
      delay: props.delay,
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
