import { PropTypes, Component } from 'react';

export default class Sampler extends Component {
  render() {
    return null;
  }
}

Sampler.propTypes = {
  sample: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  volume: PropTypes.number,
  detune: PropTypes.number,
  compressor: PropTypes.shape({
    threshold: PropTypes.number,
    knee: PropTypes.number,
    ratio: PropTypes.number,
    attack: PropTypes.number,
    release: PropTypes.number,
  }),
};

Sampler.defaultProps = {
  volume: 100,
  detune: 0,
  compressor: {
    threshold: -24,
    knee: 30,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
  },
};

Sampler.displayName = 'Sampler';
