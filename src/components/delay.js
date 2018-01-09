// @flow
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Tuna from 'tunajs';

type Props = {
  bypass?: number;
  children?: any;
  cutoff?: number;
  delayTime?: number;
  dryLevel?: number;
  feedback?: number;
  wetLevel?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Delay extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    bypass: PropTypes.number,
    children: PropTypes.node,
    cutoff: PropTypes.number,
    delayTime: PropTypes.number,
    dryLevel: PropTypes.number,
    feedback: PropTypes.number,
    wetLevel: PropTypes.number,
  };
  static defaultProps = {
    bypass: 0,
    cutoff: 2000,
    delayTime: 150,
    dryLevel: 1,
    feedback: 0.45,
    wetLevel: 0.25,
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
