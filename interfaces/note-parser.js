type Note = {
  letter: string,
  acc: string,
  pc: string,
  step: number,
  alt: number,
  chroma: number,
  oct: ?number,
  midi: ?number,
  freq: ?number,
};

declare module 'note-parser' {
  declare function regex(): RegExp;
  declare function parse(note: string, isTonic: boolean, tuning: number): Note;
  declare function build(obj: Object): string;
  declare function midi(note: string | number): number;
  declare function freq(note: string, tuning: ?string): number;
}
