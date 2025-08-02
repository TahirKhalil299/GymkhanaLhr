// src/api/constants.js

// Base URLs for different environments
export const BASE_URL = "http://192.168.0.180/WS01_BOP/api/";
// export const BASE_URL = "https://119.156.195.76/WS01_BOP/api/";
// export const BASE_URL = "https://uat.ninjahr.ai/";

// API Configuration
export const API_KEY = "234637d35a0d44db1bfec15a53c453e3";

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    REFRESH_TOKEN: 'api/auth/refresh',
    LOGIN: 'api/auth/login',
    LOGOUT: 'api/auth/logout',
  },
  USER: {
    PROFILE: 'api/user/profile',
    UPDATE_PROFILE: 'api/user/update',
  },
};

// Request Timeouts
export const TIMEOUTS = {
  REQUEST: 60000, // 60 seconds
  UPLOAD: 300000, // 5 minutes
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};