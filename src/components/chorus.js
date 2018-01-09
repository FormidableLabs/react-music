// @flow
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Tuna from 'tunajs';

type Props = {
  bypass?: number;
  children?: any;
  delay?: number;
  feedback?: number;
  rate?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Chorus extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    bypass: PropTypes.number,
    children: PropTypes.node,
    delay: PropTypes.number,
    feedback: PropTypes.number,
    rate: PropTypes.number,
  };
  static defaultProps = {
    bypass: 0,
    delay: 0.0045,
    feedback: 0.2,
    rate: 1.5,
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

    this.connectNode = new tuna.Chorus({
      feedback: props.feedback,
      rate: props.rate,
      delay: props.delay,
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
