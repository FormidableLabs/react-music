import React, { PropTypes, Component } from 'react';

export default class Bus extends Component {
  static propTypes = {
    children: PropTypes.node,
    gain: PropTypes.number,
    id: PropTypes.string.isRequired,
  };
  static defaultProps = {
    gain: 0.5,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
    getMaster: PropTypes.func,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
    getMaster: PropTypes.func,
  };
  constructor(props, context) {
    super(props);

    this.connectNode = context.audioContext.createGain();
    this.connectNode.gain.value = props.gain;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext() {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    const master = this.context.getMaster();
    master.busses[this.props.id] = this.connectNode;
  }
  componentWillReceiveProps(nextProps) {
    const master = this.context.getMaster();
    delete master.busses[this.props.id];

    this.connectNode.gain.value = nextProps.gain;
    master.busses[nextProps.id] = this.connectNode;
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
    delete this.context.getMaster().busses[this.props.id];
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
