/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component, } from 'react';
import Tuna from 'tunajs';

export default class Bitcrusher extends Component {
  static propTypes = {
    bits: PropTypes.number,
    bufferSize: PropTypes.number,
    children: PropTypes.node,
    normfreq: PropTypes.number,
  };
  static defaultProps = {
    bits: 4,
    bufferSize: 4096,
    normfreq: 0.1,
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

    this.connectNode = new tuna.Bitcrusher({
      bits: props.bits,
      normfreq: props.normfreq,
      bufferSize: props.bufferSize,
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
