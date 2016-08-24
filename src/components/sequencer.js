import React, { PropTypes, Component } from 'react';

import uuid from 'uuid';

export default class Sequencer extends Component {
  static propTypes = {
    resolution: PropTypes.number,
    bars: PropTypes.number,
    children: PropTypes.node,
  };
  static defaultProps = {
    resolution: 16,
    bars: 1,
  };
  static contextTypes = {
    getMaster: PropTypes.func,
  };
  static childContextTypes = {
    bars: PropTypes.number,
    getMaster: PropTypes.func,
    resolution: PropTypes.number,
  };
  getChildContext() {
    return {
      ...this.context,
      bars: this.props.bars,
      resolution: this.props.resolution,
    };
  }
  componentDidMount() {
    this.id = uuid.v1();
    const master = this.context.getMaster();
    master.bars[this.id] = this.props.bars;
  }
  componentWillReceiveProps(nextProps) {
    const master = this.context.getMaster();
    master.bars[this.id] = nextProps.bars;
  }
  componentWillUnmount() {
    delete this.context.getMaster().bars[this.id];
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
