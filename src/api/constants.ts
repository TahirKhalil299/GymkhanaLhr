// src/api/constants.ts

// Base URLs for different environments
export const BASE_URL: string = "http://192.168.0.180/WS01_BOP/api/";
// export const BASE_URL = "https://119.156.195.76/WS01_BOP/api/";
// export const BASE_URL = "https://uat.ninjahr.ai/";

// API Configuration
export const API_KEY: string = "234637d35a0d44db1bfec15a53c453e3";

// API Credentials
export const API_CREDENTIALS = {
  userId: "BOPEXA1",
  userPassword: "BOPExA1@712025",
  authToken: "BOpExA1547",
  customerCode: "10002",
  currencyExchangeName: "demo",

  EXCHANGE_NAMES: {
    BANK_OF_PUNJAB: "bank_of_punjab",
    SADIQ: "sadiq",
    ZEEQUE: "zeeque",
    RECL: "recl",
    ALLIED: "allied",
    ASKARI: "askari",
    LINK: "link",
    MCB: "mcb",
    FAYSAL: "faysal",
    HABIB_QATAR: "habib_qatar",
    MEEZAN: "meezan",
    UNION: "union",
    AL_HABIB: "al_habib",
    TECL: "tecl",
    DEMO: "demo",
  },
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    REFRESH_TOKEN: "api/auth/refresh",
    LOGIN: "PostVerifyLogin",
    LOGOUT: "api/auth/logout",
  },
  CURRENCY: {
    GET_RATES: "getCurrencyRates",
  },
  NETWORK_BRANCHES: {
    GET_BRANCHES: "getDealBranches",
  },
  USER: {
    PROFILE: "api/user/profile",
    UPDATE_PROFILE: "api/user/update",
  },DEAL_LIST: "GetCustomerDeals",
} as const;

// Request Timeouts
export const TIMEOUTS = {
  REQUEST: 60000, // 60 seconds
  UPLOAD: 300000, // 5 minutes
} as const;

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
} as const;

// Type definitions for better type safety
export type EndpointKey = keyof typeof ENDPOINTS;
export type AuthEndpointKey = keyof typeof ENDPOINTS.AUTH;
export type CurrencyEndpointKey = keyof typeof ENDPOINTS.CURRENCY;
export type UserEndpointKey = keyof typeof ENDPOINTS.USER;
export type HttpStatusValue = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type TimeoutKey = keyof typeof TIMEOUTS;
