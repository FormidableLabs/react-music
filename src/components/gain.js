// @flow
import React, { PropTypes, Component } from 'react';

type Props = {
  amount?: number;
  children?: any;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Gain extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
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
  constructor(props: Props, context: Context) {
    super(props);

    this.connectNode = context.audioContext.createGain();
    this.connectNode.gain.value = props.amount;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    this.connectNode.gain.value = nextProps.amount;
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
