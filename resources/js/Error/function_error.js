import { CustomError } from "./custom_error.js";

export class FunctionExpectedError extends CustomError {
  constructor(received) {
    const message = `Expected a function, but received ${typeof received}.`;
    super('FunctionExpectedError', message, 400);
  }
}