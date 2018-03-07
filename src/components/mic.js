// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

type Props = {
  children?: any;
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Mic extends Component {
  connectNode: Object;
  context: Context;
  props: Props;
  static displayName = 'Mic';
  static propTypes = {
    children: PropTypes.node,
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
    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const micSource = this.context.audioContext.createMediaStreamSource(stream);
        micSource.connect(this.context.connectNode);
      });
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
