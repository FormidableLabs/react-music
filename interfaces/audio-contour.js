declare module 'audio-contour' {
  declare function exports(
    context: Object,
    options: Object
  ): {
    connect(node: Object): void;
    start(): void;
    stop(time: number): void;
    onended: Function;
    onstart: Function;
  }
}
