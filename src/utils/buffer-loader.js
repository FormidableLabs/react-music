/* eslint-disable no-console */
export const BufferLoader = function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
};

BufferLoader.prototype.loadBuffer = function loadBuffer(url, index) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  const self = this;

  request.onload = function onload() {
    self.context.decodeAudioData(
      request.response,
      (buffer) => {
        if (!buffer) {
          console.error(`error decoding file data: ${url}`);
          return;
        }
        self.bufferList[index] = buffer;
        if (++self.loadCount === self.urlList.length) {
          self.onload(self.bufferList);
        }
      },
      (error) => {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function onError() {
    console.error('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function load() {
  for (let i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
};
