import React, { PropTypes, Component } from 'react';

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
    registerBars: PropTypes.func,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    bars: PropTypes.number,
    barInterval: PropTypes.number,
    bufferLoaded: PropTypes.func,
    connectNode: PropTypes.object,
    registerBars: PropTypes.func,
    registerBuffer: PropTypes.func,
    registerInstrument: PropTypes.func,
    resolution: PropTypes.number,
    scheduler: PropTypes.object,
    tempo: PropTypes.number,
    totalBars: PropTypes.number,
  };
  constructor(props, context) {
    super(props);

    context.registerBars(props.bars);
  }
  getChildContext() {
    return {
      ...this.context,
      bars: this.props.bars,
      resolution: this.props.resolution,
    };
  }
  render() {
    return <span>{this.props.children}</span>;
  }
}
