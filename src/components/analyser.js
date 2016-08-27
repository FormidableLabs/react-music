// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

type Props = {
  children?: any;
  fftSize?: number;
  onAudioProcess?: Function;
  smoothingTimeConstant?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Analyser extends Component {
  applyProps: Function;
  connectNode: Object;
  context: Context;
  props: Props;
  visualization: Object;
  static propTypes = {
    children: PropTypes.node,
    fftSize: PropTypes.number,
    onAudioProcess: PropTypes.func,
    smoothingTimeConstant: PropTypes.number,
  };
  static defaultProps = {
    fftSize: 128,
    onAudioProcess: () => {},
    smoothingTimeConstant: 0.3,
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

    this.visualization = context.audioContext.createScriptProcessor(2048, 1, 1);
    this.visualization.connect(context.audioContext.destination);

    this.connectNode = context.audioContext.createAnalyser();
    this.connectNode.connect(context.connectNode);
    this.applyProps = this.applyProps.bind(this);

    this.visualization.onaudioprocess = () => {
      if (props.onAudioProcess) {
        props.onAudioProcess(this.connectNode);
      }
    };
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    this.applyProps(this.props);
  }
  componentWillReceiveProps(nextProps: Props) {
    this.applyProps(nextProps);
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  applyProps(props: Props) {
    for (const prop in props) {
      if (this.connectNode[prop]) {
        this.connectNode[prop] = props[prop];
      }
    }
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
