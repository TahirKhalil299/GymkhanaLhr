// src/api/errors/NoConnectivityError.js

class NoConnectivityError extends Error {
  constructor() {
    super('No internet connection available');
    this.name = 'NoConnectivityError';
    this.message = 'Please check your internet connection and try again.';
  }
}

export default NoConnectivityError;
