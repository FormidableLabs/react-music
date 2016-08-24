/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Overdrive extends Component {
  static propTypes = {
    children: PropTypes.node,
    outputGain: PropTypes.number,
    drive: PropTypes.number,
    curveAmount: PropTypes.number,
    algorithmIndex: PropTypes.number,
    bypass: PropTypes.number,
  };
  static defaultProps = {
    outputGain: 0.5,
    drive: 0.7,
    curveAmount: 1,
    algorithmIndex: 0,
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

    this.connectNode = new tuna.Overdrive({
      outputGain: props.outputGain,
      drive: props.drive,
      curveAmount: props.curveAmount,
      algorithmIndex: props.algorithmIndex,
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
