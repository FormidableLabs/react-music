// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

type Props = {
  baseModulationFrequency?: number;
  bypass?: number;
  children?: any;
  depth?: number;
  feedback?: number;
  rate?: number;
  stereoPhase?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Phaser extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    baseModulationFrequency: PropTypes.number,
    bypass: PropTypes.number,
    children: PropTypes.node,
    depth: PropTypes.number,
    feedback: PropTypes.number,
    rate: PropTypes.number,
    stereoPhase: PropTypes.number,
  };
  static defaultProps = {
    baseModulationFrequency: 700,
    bypass: 0,
    depth: 0.3,
    feedback: 0.2,
    rate: 1.2,
    stereoPhase: 30,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object };
  constructor(props: Props, context: Context) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = new tuna.Phaser({
      rate: props.rate,
      depth: props.depth,
      feedback: props.feedback,
      stereoPhase: props.stereoPhase,
      baseModulationFrequency: props.baseModulationFrequency,
      bypass: props.bypass,
    });

    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    for (const prop in nextProps) {
      if (this.connectNode[prop]) {
        this.connectNode[prop] = nextProps[prop];
      }
    }
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
