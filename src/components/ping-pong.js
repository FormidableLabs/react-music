// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

type Props = {
  children?: any;
  delayTimeLeft?: number;
  delayTimeRight?: number;
  feedback?: number;
  wetLevel?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class PingPong extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    children: PropTypes.node,
    delayTimeLeft: PropTypes.number,
    delayTimeRight: PropTypes.number,
    feedback: PropTypes.number,
    wetLevel: PropTypes.number,
  };
  static defaultProps = {
    delayTimeLeft: 150,
    delayTimeRight: 200,
    feedback: 0.3,
    wetLevel: 0.5,
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

    this.connectNode = new tuna.PingPongDelay({
      wetLevel: props.wetLevel,
      feedback: props.feedback,
      delayTimeLeft: props.delayTimeLeft,
      delayTimeRight: props.delayTimeRight,
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
