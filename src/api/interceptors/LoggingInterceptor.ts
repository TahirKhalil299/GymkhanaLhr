// src/api/interceptors/LoggingInterceptor.ts

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const requestLoggingInterceptor = (request: AxiosRequestConfig): AxiosRequestConfig => {
  console.log(`--> ${request.method} ${request.url}`);
  console.log('Request Headers:', request.headers);
  if (request.data) {
    console.log('Request Body:', request.data);
  }
  return request;
};

export const responseLoggingInterceptor = (response: AxiosResponse): AxiosResponse => {
  console.log(`<-- ${response.status} ${response.config.url}`);
  console.log('Response:', response.data);
  return response;
};

export const errorLoggingInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response) {
    console.log(`<-- Error ${error.response.status} ${error.config?.url}`);
    console.log('Error Response:', error.response.data);
  } else {
    console.log('Network Error:', error.message);
  }
  return Promise.reject(error);
}; 