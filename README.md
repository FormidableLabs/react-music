<h1 align="center">react-music</h1>

<h4 align="center">
  Make music with React!
</h4>

***

![http://i.imgur.com/2t1NPJy.png](http://i.imgur.com/2t1NPJy.png)

> Note: This library is super experimental and alpha. It is the first release of a weekend project. I'll be working to make it better, but the current release is to just let people play around with it.

## Get Started

The easiest way to get started is to clone this repo and run `npm start`. The demo song will be running at [http://localhost:3000](http://localhost:3000). You can open up the `/demo/index.js` file and edit your song there, using the API below as reference. 

That said, you can import the primitives yourself and run your own build setup, but be aware that hot reloading doesn't work, and runtime prop changes don't propogate yet.

### Basic Concepts

#### Song

The first thing you want to do is create a `Song` component. This is the controller for your entire beat. It takes a `tempo` prop where you specify a BPM, and an `autoplay` prop that configures whether the song should play right away, or wait to press the play button. Set up it like so:

```js
<Song tempo={90}>
  
</Song>
```

#### Sequencer


Direct children of `Song` must always be `Sequencer` components. Your `Sequencer`'s are what you use to define a looping section. They take two props. The first `resolution` is the resolution of steps in your sequence array. This defaults to `16`, which is a sixteenth note. The second is `bars` which is how many bars the sequencer sequences before it loops. You can have multiple sequencers in your song, and the main Song loop is based upon the sequencer with the largest number of bars. Here is an example:

```js
<Song tempo={90}>
  <Sequencer resolution={16} bars={1}>
    
  </Sequencer>
</Song>
```

Once you have a `Song` and a `Sequencer` component, you can add instruments to your `Sequencer`. Currently, two instruments are provided, `Synth` and `Sampler`. Lets take a look at how these work:

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

## Props API

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
- Post mount prop updates don't propagate to the parent song
- The viz will be decoupled from the `Song` component, with an external API
- `Synth` components need a filter prop
- `Synth` presets need to be added
- Record/Ouput audio file
- Optional working mixing board alongside viz
- Monophonic/Polyphonic prop settings and sample trigger modes
- Note based detuning for Sampler
- Sampler sample maps

## License

[MIT License](http://opensource.org/licenses/MIT)