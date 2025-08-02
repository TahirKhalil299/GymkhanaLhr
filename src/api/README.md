# API Service Documentation

## Overview
This API service provides a comprehensive solution for making HTTP requests with authentication, error handling, and network connectivity checks. **All files have been converted to TypeScript for better type safety and developer experience.**

## ✅ TypeScript Conversion Complete
- ✅ **ServiceProvider.js → ServiceProvider.ts** - Added proper interfaces and type definitions
- ✅ **ApiService.js → ApiService.ts** - Added generic types and response interfaces
- ✅ **constants.js → constants.ts** - Added const assertions and type exports
- ✅ **ApiClient.js → ApiClient.ts** - Added Axios type definitions
- ✅ **TokenManager.js → TokenManager.ts** - Added interface for token data
- ✅ **Response.js → Response.ts** - Added proper class property types
- ✅ **alerts.js → alerts.ts** - Added React Native Alert types
- ✅ **All interceptors converted** - Added Axios request/response types
- ✅ **NoConnectivityError.js → NoConnectivityError.ts** - Maintained error class structure
- ✅ **AuthService.ts** - Fixed inheritance issues and added proper TypeScript support

## 🔧 Recent Fixes
- ✅ **Fixed ServiceProvider inheritance** - Made ServiceProvider a proper class that can be extended
- ✅ **Added request method** - Added protected request method for subclasses
- ✅ **Created model classes** - Added LoginPayload and LoginResponse models
- ✅ **Updated RequestTypes** - Added missing request type constants
- ✅ **Fixed AuthService** - Properly extends ServiceProvider with type safety

## Type Safety Improvements

### Interfaces Added:
- `ApiListener` - For API call listeners with optional callback methods
- `ApiResponse<T>` - Generic response interface
- `RefreshTokenPayload` - For token refresh requests
- `LoginCredentials` - For login requests
- `UserProfile` - For user profile data
- `TokenData` - For token storage operations
- `ApiConfig` - For HTTP request configuration

### Type Exports:
- `EndpointKey` - Type-safe endpoint access
- `HttpStatusValue` - Type-safe HTTP status codes
- `TimeoutKey` - Type-safe timeout configuration
- `RequestTypeValue` - Type-safe request type constants

## Components

### 1. ServiceProvider (Base Class)
The base class for API services with:
- Automatic token refresh
- Error categorization
- Session management
- Request cancellation
- Generic request method for subclasses

### 2. AuthService (Extends ServiceProvider)
Authentication service with:
- User login/logout
- Token refresh
- Proper TypeScript inheritance
- Model-based request/response handling

### 3. ApiClient
The main HTTP client using Axios with interceptors for:
- Authentication (Bearer tokens & API keys)
- Network connectivity checks
- Request/Response logging
- Error handling

### 4. TokenManager
Manages authentication tokens:
- Store/retrieve access tokens
- Store/retrieve refresh tokens
- Clear tokens on logout

### 5. Interceptors
- **AuthInterceptor**: Adds authentication headers
- **NetworkInterceptor**: Checks internet connectivity
- **LoggingInterceptor**: Logs requests and responses

## Usage Examples

### Using AuthService (Recommended)

```typescript
import AuthService from './src/api/AuthService';
import { ApiListener } from './src/api/ServiceProvider';

// Create AuthService instance
const authService = new AuthService();

// Login with listener
const loginResponse = await authService.login('user@example.com', 'password', {
  onRequestStarted: () => console.log('Login started'),
  onRequestSuccess: (response, data, tag) => {
    console.log('Login successful:', data);
    // Store tokens
    if (loginResponse.hasToken()) {
      // Navigate to main app
    }
  },
  onRequestFailure: (error, message, errors, tag) => {
    console.log('Login failed:', message);
  }
});

// Simple login without listener
const response = await authService.login('user@example.com', 'password');
if (response.isSuccessful()) {
  console.log('Login successful');
}

// Logout
await authService.logout();

// Refresh token
const newToken = await authService.refreshToken(refreshToken);
```

### Using ServiceProvider Directly

```typescript
import ServiceProvider from './src/api/ServiceProvider';
import { RequestType } from './src/api/RequestTypes';
import ApiService from './src/api/ApiService';

// Use singleton instance
import { serviceProvider } from './src/api/ServiceProvider';

// Example: Login user with type safety
const loginUser = async (email: string, password: string) => {
  const listener: ApiListener = {
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
  await serviceProvider.sendApiCall(loginPromise, RequestType.LOGIN, listener);
};

// Example: Get user profile with type safety
const getUserProfile = async () => {
  const listener: ApiListener = {
    onRequestSuccess: (response, data, tag) => {
      console.log('Profile loaded:', data);
    },
    onRequestFailure: (error, message, errors, tag) => {
      console.log('Failed to load profile:', message);
    },
  };

  const profilePromise = ApiService.getUserProfile();
  await serviceProvider.sendApiCall(profilePromise, RequestType.GET_PROFILE, listener);
};
```

## Configuration

### Environment Setup
Update `src/api/constants.ts` to configure:
- Base URL for your API
- API Key
- Request timeouts
- Endpoints

### Request Types
Add new request types in `src/api/RequestTypes.ts`:
```typescript
export const RequestType = {
  LOGIN: 'LOGIN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  GET_PROFILE: 'GET_PROFILE',
  // Add more as needed
} as const;
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
- `typescript` - Type safety and development experience

## Benefits of TypeScript Conversion
- ✅ **Type Safety** - Catch errors at compile time
- ✅ **Better IntelliSense** - Enhanced IDE support
- ✅ **Refactoring Safety** - Safe code refactoring
- ✅ **Documentation** - Types serve as inline documentation
- ✅ **Maintainability** - Easier to maintain and extend
- ✅ **Inheritance Support** - Proper class inheritance for service extensions 