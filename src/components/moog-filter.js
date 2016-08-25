/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component, } from 'react';
import Tuna from 'tunajs';

export default class MoogFilter extends Component {
  static propTypes = {
    bufferSize: PropTypes.number,
    children: PropTypes.node,
    cutoff: PropTypes.number,
    resonance: PropTypes.number,
  };
  static defaultProps = {
    bufferSize: 4096,
    cutoff: 0.065,
    resonance: 3.5,
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

    this.connectNode = new tuna.MoogFilter({
      cutoff: props.cutoff,
      resonance: props.resonance,
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
