// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

type Props = {
  Q?: number;
  children?: any;
  frequency?: number;
  gain?: number;
  type?: string;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Filter extends Component {
  applyProps: Function;
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    Q: PropTypes.number,
    children: PropTypes.node,
    frequency: PropTypes.number,
    gain: PropTypes.number,
    type: PropTypes.string,
  };
  static defaultProps = {
    Q: 0,
    frequency: 2000,
    gain: 0,
    type: 'lowpass',
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

    this.connectNode = context.audioContext.createBiquadFilter();
    this.connectNode.connect(context.connectNode);

    this.applyProps = this.applyProps.bind(this);
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
    for (const prop in nextProps) {
      if (this.connectNode[prop]) {
        this.connectNode[prop] = nextProps[prop];
      }
    }
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  applyProps(props: Props) {
    for (const prop in props) {
      if (this.connectNode[prop]) {
        if (typeof this.connectNode[prop] === 'object') {
          this.connectNode[prop].value = props[prop];
        } else {
          this.connectNode[prop] = props[prop];
        }
      }
    }
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
