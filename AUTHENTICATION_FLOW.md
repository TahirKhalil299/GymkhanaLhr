# Authentication Flow Implementation

## Overview
This document describes the complete authentication flow implemented in the GymKhanaLhr app, including persistent login state management.

## Key Components

### 1. UserDataManager (`utils/userDataManager.ts`)
The central class for managing user authentication state and data persistence.

**Key Methods:**
- `saveUserData(userData)`: Saves user information
- `saveTokens(accessToken, refreshToken)`: Saves authentication tokens
- `setLoginState(isLoggedIn)`: Sets the login state (true/false)
- `getLoginState()`: Retrieves the current login state
- `isLoggedIn()`: Checks if user is currently logged in
- `clearAllData()`: Clears all stored authentication data
- `getUserData()`: Retrieves stored user data

### 2. Authentication Flow

#### Login Process:
1. User enters credentials on login screen
2. API call is made to authenticate user
3. On successful login:
   - User data is saved using `saveUserData()`
   - Tokens are saved using `saveTokens()`
   - Login state is set to `true` using `setLoginState(true)`
   - User is navigated to home screen

#### Logout Process:
1. User clicks logout button on home screen
2. Confirmation dialog is shown
3. On confirmation:
   - AuthService logout API call is made
   - All local data is cleared using `clearAllData()`
   - Login state is set to `false` using `setLoginState(false)`
   - User is navigated to login screen

#### App Startup Process:
1. App starts with splash screen (index.tsx)
2. `UserDataManager.isLoggedIn()` is called to check authentication status
3. If user is logged in: navigate to home screen
4. If user is not logged in: navigate to login screen

## Storage Keys

The following keys are used in AsyncStorage:
- `userData`: Stores user information
- `accessToken`: Stores access token
- `refreshToken`: Stores refresh token
- `isLoggedIn`: Stores boolean login state

## Login State Logic

The `isLoggedIn()` method checks:
1. Login state is `true` AND
2. User data exists

This ensures that both the explicit login state and user data are present for a valid login session.

## Error Handling

- All storage operations are wrapped in try-catch blocks
- If logout API call fails, local data is still cleared
- Navigation errors are handled gracefully
- Console logging is used for debugging

## Usage Examples

### Checking if user is logged in:
```typescript
const isLoggedIn = await UserDataManager.isLoggedIn();
if (isLoggedIn) {
  // Navigate to home
} else {
  // Navigate to login
}
```

### Logging out:
```typescript
await UserDataManager.clearAllData();
await UserDataManager.setLoginState(false);
router.replace('/login');
```

### Setting login state after successful login:
```typescript
await UserDataManager.saveUserData(userData);
await UserDataManager.saveTokens(accessToken, refreshToken);
await UserDataManager.setLoginState(true);
```

## Benefits

1. **Persistent Login**: Users stay logged in between app sessions
2. **Automatic Navigation**: App automatically navigates to correct screen based on login state
3. **Secure Logout**: Complete data cleanup on logout
4. **Error Resilience**: Handles API failures gracefully
5. **Debugging Support**: Comprehensive logging for troubleshooting 