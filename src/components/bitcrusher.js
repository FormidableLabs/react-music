// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

type Props = {
  bits?: number;
  bufferSize?: number;
  children?: any;
  normfreq?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Bitcrusher extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    bits: PropTypes.number,
    bufferSize: PropTypes.number,
    children: PropTypes.node,
    normfreq: PropTypes.number,
  };
  static defaultProps = {
    bits: 8,
    bufferSize: 256,
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
  constructor(props: Props, context: Context) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = new tuna.Bitcrusher({
      bits: props.bits,
      normfreq: props.normfreq,
      bufferSize: props.bufferSize,
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
