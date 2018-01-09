// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types'

type Props = {
  children?: any;
  gain?: number;
  id: string;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
  getMaster: Function;
};

export default class Bus extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
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
  constructor(props: Props, context: Context) {
    super(props);

    this.connectNode = context.audioContext.createGain();
    this.connectNode.gain.value = props.gain;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    const master = this.context.getMaster();
    master.busses[this.props.id] = this.connectNode;
  }
  componentWillReceiveProps(nextProps: Props) {
    const master = this.context.getMaster();
    delete master.busses[this.props.id];

    this.connectNode.gain.value = nextProps.gain;
    master.busses[nextProps.id] = this.connectNode;
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
    delete this.context.getMaster().busses[this.props.id];
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
