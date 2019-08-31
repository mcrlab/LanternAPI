export default class LightNotFoundError {
  constructor(message = 'Light not found'){
    this.status = 404;
    this.message = message;
  }
}
