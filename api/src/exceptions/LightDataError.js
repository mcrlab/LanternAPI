export default class LightDataError {
  constructor(status = 500, message = 'An unknown error has occurred') {
    this.status = status;
    this.message = message;
  }
}
