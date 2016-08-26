// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class MoogFilter extends Component {
  connectNode: Object;
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
  constructor(props: Object, context: Object) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = new tuna.MoogFilter({
      cutoff: props.cutoff,
      resonance: props.resonance,
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
