// src/api/interceptors/LoggingInterceptor.js

export const requestLoggingInterceptor = (request) => {
  console.log(`--> ${request.method} ${request.url}`);
  console.log('Request Headers:', request.headers);
  if (request.data) {
    console.log('Request Body:', request.data);
  }
  return request;
};

export const responseLoggingInterceptor = (response) => {
  console.log(`<-- ${response.status} ${response.config.url}`);
  console.log('Response:', response.data);
  return response;
};

export const errorLoggingInterceptor = (error) => {
  if (error.response) {
    console.log(`<-- Error ${error.response.status} ${error.config.url}`);
    console.log('Error Response:', error.response.data);
  } else {
    console.log('Network Error:', error.message);
  }
  return Promise.reject(error);
};