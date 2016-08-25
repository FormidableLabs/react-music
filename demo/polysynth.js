import React, { PropTypes, } from 'react';

import {
  Delay,
  MoogFilter,
  Reverb,
  Synth,
} from '../src';

const Polysynth = (props) => (
  <Delay>
    <Reverb>
      <Synth
        type="sine"
        gain={0.15}
        steps={props.steps}
      />
      <MoogFilter>
        <Synth
          type="square"
          gain={0.15}
          transpose={1}
          steps={props.steps}
        />
      </MoogFilter>
    </Reverb>
  </Delay>
);

Polysynth.propTypes = {
  steps: PropTypes.array,
};

export default Polysynth;
