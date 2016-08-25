import React, { PropTypes, Component } from 'react';

export default class Gain extends Component {
  static propTypes = {
    amount: PropTypes.number,
    children: PropTypes.node,
  };
  static defaultProps = {
    amount: 0.0,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  constructor(props, context) {
    super(props);

    this.connectNode = context.audioContext.createGain();
    this.connectNode.gain.value = props.amount;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext() {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.connectNode.gain.value = nextProps.amount;
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
