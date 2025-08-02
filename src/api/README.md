# API Service Documentation

## Overview
This API service provides a comprehensive solution for making HTTP requests with authentication, error handling, and network connectivity checks.

## Fixed Issues
- ✅ **API_KEY is not defined** - Added proper import in AuthInterceptor
- ✅ **AsyncStorage is not defined** - Added proper import in ServiceProvider
- ✅ **Missing NoConnectivityError** - Created the missing error class
- ✅ **Improved constants organization** - Better structure with endpoints and status codes

## Components

### 1. ApiClient
The main HTTP client using Axios with interceptors for:
- Authentication (Bearer tokens & API keys)
- Network connectivity checks
- Request/Response logging
- Error handling

### 2. ServiceProvider
Handles API calls with:
- Automatic token refresh
- Error categorization
- Session management
- Request cancellation

### 3. TokenManager
Manages authentication tokens:
- Store/retrieve access tokens
- Store/retrieve refresh tokens
- Clear tokens on logout

### 4. Interceptors
- **AuthInterceptor**: Adds authentication headers
- **NetworkInterceptor**: Checks internet connectivity
- **LoggingInterceptor**: Logs requests and responses

## Usage Example

```javascript
import ServiceProvider from './src/api/ServiceProvider';
import { RequestType } from './src/api/RequestTypes';
import ApiService from './src/api/ApiService';

// Example: Login user
const loginUser = async (email, password) => {
  const listener = {
    onRequestStarted: () => console.log('Login started'),
    onRequestSuccess: (response, data, tag) => {
      console.log('Login successful:', data);
      // Handle successful login
    },
    onRequestFailure: (error, message, errors, tag) => {
      console.log('Login failed:', message);
      // Handle login failure
    },
    onRequestEnded: () => console.log('Login ended'),
  };

  const loginPromise = ApiService.login({ email, password });
  await ServiceProvider.sendApiCall(loginPromise, RequestType.LOGIN, listener);
};

// Example: Get user profile
const getUserProfile = async () => {
  const listener = {
    onRequestSuccess: (response, data, tag) => {
      console.log('Profile loaded:', data);
    },
    onRequestFailure: (error, message, errors, tag) => {
      console.log('Failed to load profile:', message);
    },
  };

  const profilePromise = ApiService.getUserProfile();
  await ServiceProvider.sendApiCall(profilePromise, RequestType.GET_PROFILE, listener);
};
```

## Configuration

### Environment Setup
Update `src/api/constants.js` to configure:
- Base URL for your API
- API Key
- Request timeouts
- Endpoints

### Request Types
Add new request types in `src/api/RequestTypes.js`:
```javascript
export const RequestType = {
  LOGIN: 'LOGIN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  GET_PROFILE: 'GET_PROFILE',
  // Add more as needed
};
```

## Error Handling
The service automatically handles:
- Network connectivity issues
- Authentication failures (401)
- Token refresh
- Server errors
- Rate limiting (429)

## Dependencies
- `@react-native-async-storage/async-storage` - Token storage
- `@react-native-community/netinfo` - Network connectivity
- `axios` - HTTP client 