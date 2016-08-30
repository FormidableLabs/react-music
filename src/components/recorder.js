// @flow
import React, { PropTypes, Component } from 'react';
import { getWAV, interleave, mergeBuffers } from '../utils/recorder';

type Props = {
  children?: any;
  onRecordStop?: Function;
  smoothingTimeConstant?: number;
  isRecording?: boolean
};

type Context = {
  audioContext: Object;
  connectNode: Object;
};

export default class Recorder extends Component {
  context: Context;
  props: Props;
  static propTypes = {
    children: PropTypes.node,
    isRecording: PropTypes.bool,
    onRecordStop: PropTypes.func,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  constructor(props: Props, context: Context) {
    super(props);

    const bufferSize = 2048;
    this.isRecording = props.isRecording;
    this.processor = context.audioContext.createScriptProcessor(bufferSize, 2, 2);
    this.processor.recordingLength = 0;
    this.processor.leftChannel = [];
    this.processor.rightChannel = [];
    this.onRecordStop = props.onRecordStop;

    this.processor.onaudioprocess = (e) => {
      const left = e.inputBuffer.getChannelData(0);
      const right = e.inputBuffer.getChannelData(1);
      // we clone the samples
      this.processor.leftChannel.push(new Float32Array(left));
      this.processor.rightChannel.push(new Float32Array(right));
      this.processor.recordingLength += bufferSize;
    };

    this.processor.stop = () => {
      this.isRecording = false;
      const left = mergeBuffers(this.processor.leftChannel, this.processor.recordingLength);
      const right = mergeBuffers(this.processor.rightChannel, this.processor.recordingLength);
      const interleavedChannels = interleave(left, right);
      const blob = getWAV(interleavedChannels, context.audioContext.sampleRate);

      this.processor.disconnect();
      this.onRecordStop(blob);
    };

    this.connectNode = this.processor;
    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isRecording && !nextProps.isRecording) {
      this.processor.stop();
    }
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
