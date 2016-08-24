/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

export default class Sequencer extends Component {
  static propTypes = {
    children: PropTypes.node,
    threshold: PropTypes.number,
    knee: PropTypes.number,
    ratio: PropTypes.number,
    attack: PropTypes.number,
    release: PropTypes.number,
  };
  static defaultProps = {
    threshold: -24,
    knee: 32,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    bufferLoaded: PropTypes.func,
    connectNode: PropTypes.object,
    registerBuffer: PropTypes.func,
    registerInstrument: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
    totalBars: PropTypes.number,
  };
  constructor(props, context) {
    super(props);

    this.connectNode = context.audioContext.createDynamicsCompressor();
    this.connectNode.connect(context.connectNode);

    this.applyProps = this.applyProps.bind(this);
  }
  getChildContext() {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    this.applyProps(this.props);
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  applyProps(props) {
    for (const prop in props) {
      if (this.connectNode[prop]) {
        this.connectNode[prop].value = props[prop];
      }
    }
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
