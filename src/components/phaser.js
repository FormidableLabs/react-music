// @flow
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Tuna from 'tunajs';

type Props = {
  bypass?: bool;
  children?: any;
  baseModulationFrequency?: number,
  stereoPhase?: number,
  depth?: number,
  feedback?: number,
  rate?: number,
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
    bypass: PropTypes.bool,
    children: PropTypes.node,
    baseModulationFrequency: PropTypes.number,
    stereoPhase: Proptypes.number,
    depth: PropTypes.number,
    feedback: PropTypes.number,
    rate: PropTypes.number,
  };
  static defaultProps = {
    rate: 0.1,
    depth: 0.6,
    feedback: 0.7,
    stereoPhase: 40,
    baseModulationFrequency: 700,
    bypass: false
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  constructor(props: Props, context: Context) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = phaser = new tuna.Phaser({
        rate: props.rate,
        depth: props.depth,
        feedback: props.feedback,
        stereoPhase: props.stereoPhase,
        baseModulationFrequency: props.baseModulationFrequency,
        bypass: props.bypass
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
