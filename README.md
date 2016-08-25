<h1 align="center">react-music</h1>

<h4 align="center">
  Make music with React!
</h4>

***

![http://i.imgur.com/2t1NPJy.png](http://i.imgur.com/2t1NPJy.png)

## Install

`npm install react-music`

## Get Started

The easiest way to get started is to clone this repo and run `npm start`. The demo song will be running at [http://localhost:3000](http://localhost:3000). You can open up the `/demo/index.js` file and edit your song there, using the API below as reference.

That said, you can import the primitives yourself and run your own build setup if you want.

## Basic Concepts

#### Song

The first thing you want to do is create a `Song` component. This is the controller for your entire beat. It takes a `tempo` prop where you specify a BPM, and an `autoplay` prop that configures whether the song should play right away, or wait to press the play button. Set up it like so:

```js
<Song tempo={90}>

</Song>
```

#### Sequencer


Your `Sequencer`'s are what you use to define a looping section. They take two props. The first `resolution` is the resolution of steps in your sequence array. This defaults to `16`, which is a sixteenth note. The second is `bars` which is how many bars the sequencer sequences before it loops. You can have multiple sequencers in your song, and the main Song loop is based upon the sequencer with the largest number of bars. Here is an example:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>

  </Sequencer>
</Song>
```

Once you have a `Song` and a `Sequencer` component, you can add instruments to your `Sequencer`. Lets take a look at how these work:

## Instruments

#### Sampler

The sampler component is used to play audio samples. To use it, you must at very least provide two props, `sample` and `steps`.`sample` is a path to an audio file, and `steps` is an array of indexes that map to the steps available based upon the `resolution` and `bars` props of your sequencer. So if you wanted a 4/4 kick line, you would do this:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>
    <Sampler
	  sample="/samples/kick.wav"
	  steps={[0, 4, 8, 12]}
    />
  </Sequencer>
</Song>
```

You can also provide an array for a step, where the second value is a tuning, from -12 to 12.

#### Synth

The `Synth` component is used to create an oscillator and play it on steps, just like the `Sampler` does. To use it, you must provide two props, `type` and `steps`. Valid types are `sine`, `square`, `triangle` and `sawtooth`. The `Synth` component also takes an `envelope` prop, where you can specify your ASDR settings. The shape of the `step` prop is a bit different for the `Synth` component, as you must specify an array in the format of `[ step, duration, note || [notes] ]`. The `duration` portion specifies duration in steps. The `note` portion is a string of a musical note and octave like "a4" or "c#1", and for chords, can be an array of the same notes. This would look like:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>
    <Synth
      type="square"
	  steps={[
	    [0, 2, "c3"],
	    [8, 2, ["c3", "d#3", "f4"]]
	  ]}
    />
  </Sequencer>
</Song>
```

#### Monosynth

The `Monosynth` component is a `Synth` component, but it only plays one note at a time. Further, it has a `glide` prop that specifies portamento length. So if two notes overlap, the monosynth glides up to the next value on that duration. Check out how:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>
    <Monosynth
      glide={0.5}
      type="square"
      steps={[
        [0, 5, "c3"],
        [4, 4, "c4"],
      ]}
    />
  </Sequencer>
</Song>
```

## Effects

There are a ton of new effects added in 1.0.0. You can compose effect chains by wrapping effects around your instruments. Here is an example of how you would do that:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>
    <Reverb>
      <Delay>
        <Monosynth
          steps={[
            [0, 4, "c3"],
            [4, 4, "c4"],
          ]}
        />
      </Delay>
    </Reverb>
  </Sequencer>
</Song>
```

### Effect Busses

If you want to define an effects bus, which is a set of effects that multiple instruments can send their output to, this is achieved with the `Bus` component.

First you want to create a `Bus` component, and give it an identifier:

```js
<Song tempo={90}>
  <Bus id="myBus"/>
</Song>
```

Next, wrap your bus with the effect chain you want to make available, similarly to the way you would wrap effects around an instrument. You generally want to do this with effects that have wet/dry control, and set the `dryLevel` to 0:

```js
<Song tempo={90}>
  <Delay dryValue={0}>
    <Bus id="myBus"/>
  </Delay>
</Song>
```

Finally, to hook an instrument up to your bus, or several busses, add their id's to the `busses` prop on an instrument:

```js
<Song tempo={90}>
  <Delay dryValue={0}>
    <Bus id="myBus"/>
  </Delay>
  <Sampler
  	busses={['myBus']}
  	sample='/samples/kick.wav'
  	steps={[1,4,8,12]}
  />
</Song>
```

## LFO

You know whats bananas? LFO. Thats what. You can use an oscillator to modify properties of your instruments and effects. This is done with the `LFO` component. Any node that you want to apply LFO to just needs it added as a child. Then you define a `connect` prop that returns a function that lets you select a parent AudioNode property to oscillate. See the following example.

```js
<Song tempo={90}>
  <Synth
    type="square"
    steps={[
      [0, 2, "c3"],
      [8, 2, ["c3", "d#3", "f4"]]
    ]}
  >
    <LF0
      type="sine"
      frequency={0.05}
      connect={(c) => c.gain}
    />	
  </Synth>
</Song>
```

## API

### Song

**tempo** (_number_) : Your song tempo

**autoplay** (_boolean_) : Whether the song should start playing automatically

### Sequencer

**resolution** (_number_) : Step resolution for your sequence

**bars** (_number_) : Number of bars in your sequence

### Sampler

**sample** (_number_) : Step resolution for your sequence

**steps** (_array_) : Array of step indexes for the sample to be played at

**volume** (_number_) : A number (0-100) specifying instrument volume

**detune** (_number_) : A number (in cents) specifying instrument detune

**compressor** (_object_) : An object specifying compressor settings

```js
compressor={{
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 0.003,
  release: 0.25,
}}
```

### Synth

**type** (_string_) : Oscillator type. Accepts `square`, `triangle`, `sawtooth` & `sine`

**steps** (_array_) : Array of step arrays for the notes to be played at. Accepts in array in the `[ step, duration, note || [notes] ]` format.

```js
// single note
steps={[
  [0, 2, "a2"]
]}

// chord
steps={[
  [0, 2, ["c2", "e2", "g2"]]
]}
```

**volume** (_number_) : A number (0-100) specifying instrument volume

**envelope** (_object_) : An object specifying envelope settings

```js
envelope={{
  attack: 0.1,
  sustain: 0.3,
  decay: 20,
  release: 0.5
}}
```

**compressor** (_object_) : An object specifying compressor settings

```js
compressor={{
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 0.003,
  release: 0.25,
}}
```

## Known Issues & Roadmap

- Currently only the 4/4 time signature is supported
- Hot reloading doesn't work
- `Synth` presets need to be added
- Record/Ouput audio file
- Optional working mixing board alongside viz
- Sampler sample maps


## License

[MIT License](http://opensource.org/licenses/MIT)