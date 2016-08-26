declare type TunaInstance = {
  Bitcrusher: (options: Object) => Object;
  Chorus: (options: Object) => Object;
  Convolver: (options: Object) => Object;
  Delay: (options: Object) => Object;
  MoogFilter: (options: Object) => Object;
  Overdrive: (options: Object) => Object;
  Phaser: (options: Object) => Object;
  PingPongDelay: (options: Object) => Object;
};

declare class Tuna {
  constructor(context: Object): TunaInstance;
}

declare module 'tunajs' {
  declare var exports: typeof Tuna;
}
