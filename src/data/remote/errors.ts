export class NetworkError extends Error {
  constructor(message = 'Unable to reach the server.') {
    super(message);
    this.name = 'NetworkError';
  }
}
