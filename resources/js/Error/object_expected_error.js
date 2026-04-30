import { CustomError } from "./custom_error.js";

export class ObjectExpectedError extends CustomError {
  constructor(received) {
    const message = `Expected a object, but received ${typeof received}.`;
    super('ObjectExpectedError', message, 400);
  }
}