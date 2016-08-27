// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

type Props = {
  algorithmIndex?: number;
  bypass?: number;
  children?: any;
  curveAmount?: number;
  drive?: number;
  outputGain?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Overdrive extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    algorithmIndex: PropTypes.number,
    bypass: PropTypes.number,
    children: PropTypes.node,
    curveAmount: PropTypes.number,
    drive: PropTypes.number,
    outputGain: PropTypes.number,
  };
  static defaultProps = {
    algorithmIndex: 0,
    bypass: 0,
    curveAmount: 1,
    drive: 0.7,
    outputGain: 0.5,
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

    this.connectNode = new tuna.Overdrive({
      outputGain: props.outputGain,
      drive: props.drive,
      curveAmount: props.curveAmount,
      algorithmIndex: props.algorithmIndex,
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
