import { PropTypes, Component } from 'react';

export default class Sequencer extends Component {
  render() {
    return null;
  }
}

Sequencer.propTypes = {
  resolution: PropTypes.number,
  bars: PropTypes.number,
};

Sequencer.defaultProps = {
  resolution: 16,
  bars: 1,
};
