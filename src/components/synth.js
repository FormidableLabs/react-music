import { PropTypes, Component } from 'react';

export default class Synth extends Component {
  render() {
    return null;
  }
}

Synth.propTypes = {
  type: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  volume: PropTypes.number,
  compressor: PropTypes.shape({
    threshold: PropTypes.number,
    knee: PropTypes.number,
    ratio: PropTypes.number,
    attack: PropTypes.number,
    release: PropTypes.number,
  }),
  envelope: PropTypes.shape({
    attack: PropTypes.number,
    decay: PropTypes.number,
    sustain: PropTypes.number,
    release: PropTypes.number,
  }),
};

Synth.defaultProps = {
  volume: 100,
  compressor: {
    threshold: -24,
    knee: 30,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
  },
  envelope: {
    attack: 0.1,
    decay: 0,
    sustain: 0.1,
    release: 0.1,
  },
};

Synth.displayName = 'Synth';
