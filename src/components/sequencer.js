// @flow
import React, { PropTypes, Component } from 'react';

import uuid from 'uuid';

export default class Sequencer extends Component {
  id: String;
  static propTypes = {
    bars: PropTypes.number,
    children: PropTypes.node,
    resolution: PropTypes.number,
  };
  static defaultProps = {
    bars: 1,
    resolution: 16,
  };
  static contextTypes = {
    getMaster: PropTypes.func,
  };
  static childContextTypes = {
    bars: PropTypes.number,
    getMaster: PropTypes.func,
    resolution: PropTypes.number,
  };
  getChildContext(): Object {
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
  componentWillReceiveProps(nextProps: Object) {
    const master = this.context.getMaster();
    master.bars[this.id] = nextProps.bars;
  }
  componentWillUnmount() {
    delete this.context.getMaster().bars[this.id];
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
