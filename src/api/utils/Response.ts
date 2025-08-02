// src/api/utils/Response.ts

interface ResponseData {
  StatusDesc?: string;
  StatusCode?: string;
  data?: any;
}

export default class Response {
  public StatusDesc: string;
  public StatusCode: string;
  public data: any;

  constructor(data?: ResponseData) {
    this.StatusDesc = data?.StatusDesc || '';
    this.StatusCode = data?.StatusCode || '';
    this.data = data?.data || null;
  }
} 