// src/api/utils/Response.js

export default class Response {
  constructor(data) {
    this.StatusDesc = data?.StatusDesc || '';
    this.StatusCode = data?.StatusCode || '';
    this.data = data?.data || null;
  }
}