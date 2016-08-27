type UUIDGenerator = () => string;

declare module 'uuid' {
  declare function exports(
    v1: UUIDGenerator
  ): Contour
}
