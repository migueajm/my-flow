import { CustomError } from "./custom_error.js";

export class KeyWasExpectedError extends CustomError {
  constructor(key) {
    const message = `The key "${key}" was expected.`;
    super('KeyWasExpectedError', message, 400);
  }
}