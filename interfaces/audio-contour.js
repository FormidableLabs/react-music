type Contour = {
  connect(node: Object): void,
  start(): void,
  stop(time: number): void,
  onended: Function,
  onstart: Function,
};

declare module 'audio-contour' {
  declare function exports(
    context: Object,
    options: Object
  ): Contour
}
