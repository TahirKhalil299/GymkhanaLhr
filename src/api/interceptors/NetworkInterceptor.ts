// src/api/interceptors/NetworkInterceptor.ts

import { AxiosRequestConfig } from 'axios';

export const networkInterceptor = async (request: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  // For now, we'll skip network connectivity check to avoid NetInfo issues
  // You can re-enable this later when NetInfo is properly configured
  return request;
}; 