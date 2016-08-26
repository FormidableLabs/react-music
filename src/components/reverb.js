// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Reverb extends Component {
  connectNode: Object;
  static propTypes = {
    bypass: PropTypes.number,
    children: PropTypes.node,
    dryLevel: PropTypes.number,
    highCut: PropTypes.number,
    impulse: PropTypes.string,
    level: PropTypes.number,
    lowCut: PropTypes.number,
    wetLevel: PropTypes.number,
  };
  static defaultProps = {
    bypass: 0,
    dryLevel: 1,
    highCut: 22050,
    impulse: 'reverb/room.wav',
    level: 1,
    lowCut: 20,
    wetLevel: 1,
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

    this.connectNode = new tuna.Convolver({
      highCut: props.highCut,
      lowCut: props.lowCut,
      dryLevel: props.dryLevel,
      wetLevel: props.wetLevel,
      level: props.level,
      impulse: props.impulse,
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
