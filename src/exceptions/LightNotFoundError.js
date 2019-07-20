export default class LightNotFoundError {
  constructor(status = 404, message = 'Light not found'){
    this.status = status;
    this.message = message;
  }
}
