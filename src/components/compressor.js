// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

type Props = {
  attack?: number;
  children?: any;
  knee?: number;
  ratio?: number;
  release?: number;
  threshold?: number;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Compressor extends Component {
  applyProps: Function;
  connectNode: Object;
  context: Context;
  props: Props;
  static propTypes = {
    attack: PropTypes.number,
    children: PropTypes.node,
    knee: PropTypes.number,
    ratio: PropTypes.number,
    release: PropTypes.number,
    threshold: PropTypes.number,
  };
  static defaultProps = {
    attack: 0.003,
    knee: 32,
    ratio: 12,
    release: 0.25,
    threshold: -24,
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

    this.connectNode = context.audioContext.createDynamicsCompressor();
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
    this.applyProps(nextProps);
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  applyProps(props: Props) {
    for (const prop in props) {
      if (this.connectNode[prop]) {
        this.connectNode[prop].value = props[prop];
      }
    }
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
