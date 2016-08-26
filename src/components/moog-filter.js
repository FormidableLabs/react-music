// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

type Props = {
  bufferSize?: number;
  children?: any;
  cutoff?: number;
  resonance?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class MoogFilter extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
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
  constructor(props: Props, context: Context) {
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
