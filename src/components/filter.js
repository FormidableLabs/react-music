/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';

export default class Filter extends Component {
  static propTypes = {
    children: PropTypes.node,
    frequency: PropTypes.number,
    Q: PropTypes.number,
    gain: PropTypes.number,
    type: PropTypes.string,
  };
  static defaultProps = {
    frequency: 2000,
    Q: 0,
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
  constructor(props, context) {
    super(props);

    this.connectNode = context.audioContext.createBiquadFilter();
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
        if (typeof this.connectNode[prop] === 'object') {
          this.connectNode[prop].value = props[prop];
        } else {
          this.connectNode[prop] = props[prop];
        }
      }
    }
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
