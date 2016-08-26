// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Bitcrusher extends Component {
  connectNode: Object;
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
  constructor(props: Object, context: Object) {
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
  componentWillReceiveProps(nextProps: Object) {
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
