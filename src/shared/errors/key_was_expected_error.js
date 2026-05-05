export class KeyWasExpectedError extends Error {
  constructor(keyName = 'key') {
    super(`${keyName} was expected`);
    this.name = 'KeyWasExpectedError';
  }
}
