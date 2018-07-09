export default class GeneralError extends Error {
  constructor(message, errorCode) {
    super(message)
    this.name = 'Custom Runtime Error'
    this.errorCode = errorCode
    this.stack = new Error().stack
  }
}
