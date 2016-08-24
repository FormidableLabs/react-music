/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

export default class Sequencer extends Component {
  static propTypes = {
    children: PropTypes.node,
    smoothingTimeConstant: PropTypes.number,
    fftSize: PropTypes.number,
    onAudioProcess: PropTypes.func,
  };
  static defaultProps = {
    smoothingTimeConstant: 0.3,
    fftSize: 128,
    onAudioProcess: () => {},
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

    this.visualization = context.audioContext.createScriptProcessor(2048, 1, 1);
    this.visualization.connect(context.audioContext.destination);

    this.connectNode = context.audioContext.createAnalyser();
    this.connectNode.connect(context.connectNode);
    this.applyProps = this.applyProps.bind(this);

    this.visualization.onaudioprocess = () => {
      props.onAudioProcess(this.connectNode);
    };
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
        this.connectNode[prop] = props[prop];
      }
    }
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
