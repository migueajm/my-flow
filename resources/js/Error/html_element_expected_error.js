import { CustomError } from "./custom_error.js";

export class HtmlElementExpectedError extends CustomError {
  constructor(received) {
    const message = `Expected a HTMLFormElement, but received ${typeof received}(${received}).`;
    super('HtmlElementExpectedError', message, 400);
  }
}