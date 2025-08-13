import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserData } from '../src/api/models/LoginResponse';

export class UserDataManager {
  private static readonly USER_DATA_KEY = 'userData';
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly IS_LOGGED_IN_KEY = 'isLoggedIn';
  // New keys for saving credentials
  private static readonly USER_ID_KEY = 'saved_user_id';
  private static readonly PASSWORD_KEY = 'saved_password';

  static async saveUserData(userData: IUserData): Promise<void> {
    try {
      console.log('UserDataManager: Saving user data:', userData);
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      console.log('UserDataManager: User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  static async getUserData(): Promise<IUserData | null> {
    try {
      console.log('UserDataManager: Getting user data...');
      const userDataString = await AsyncStorage.getItem(this.USER_DATA_KEY);
      console.log('UserDataManager: User data string retrieved:', userDataString ? 'exists' : 'null');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
       // console.log('UserDataManager: Parsed user data:', parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async saveTokens(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      console.log('UserDataManager: Saving tokens - accessToken:', accessToken ? 'present' : 'missing', 'refreshToken:', refreshToken ? 'present' : 'missing');
      if (accessToken) {
        await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        console.log('UserDataManager: Access token saved');
      }
      if (refreshToken) {
        await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        console.log('UserDataManager: Refresh token saved');
      }
      console.log('UserDataManager: Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      console.log('UserDataManager: Getting access token...');
      const token = await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
      console.log('UserDataManager: Access token retrieved:', token ? 'exists' : 'null');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async setLoginState(isLoggedIn: boolean): Promise<void> {
    try {
      console.log('UserDataManager: Setting login state to:', isLoggedIn);
      await AsyncStorage.setItem(this.IS_LOGGED_IN_KEY, JSON.stringify(isLoggedIn));
      console.log('UserDataManager: Login state saved successfully');
    } catch (error) {
      console.error('Error saving login state:', error);
      throw error;
    }
  }

  static async getLoginState(): Promise<boolean> {
    try {
      console.log('UserDataManager: Getting login state...');
      const loginStateString = await AsyncStorage.getItem(this.IS_LOGGED_IN_KEY);
      console.log('UserDataManager: Login state string retrieved:', loginStateString);
      if (loginStateString) {
        const isLoggedIn = JSON.parse(loginStateString);
        console.log('UserDataManager: Parsed login state:', isLoggedIn);
        return isLoggedIn;
      }
      return false;
    } catch (error) {
      console.error('Error getting login state:', error);
      return false;
    }
  }

  /**
   * Save user credentials (User ID and Password)
   * @param {string} userId - User ID to save
   * @param {string} password - Password to save
   */
  static async saveUserCredentials(userId: string, password: string): Promise<void> {
    try {
      console.log('UserDataManager: Saving user credentials - userId:', userId ? 'present' : 'missing');
      await AsyncStorage.multiSet([
        [this.USER_ID_KEY, userId],
        [this.PASSWORD_KEY, password]
      ]);
      console.log('UserDataManager: User credentials saved successfully');
    } catch (error) {
      console.error('Error saving user credentials:', error);
      throw error;
    }
  }

  /**
   * Get saved User ID
   * @returns {Promise<string|null>} - Saved User ID or null if not found
   */
  static async getSavedUserId(): Promise<string | null> {
    try {
      console.log('UserDataManager: Getting saved user ID...');
      const userId = await AsyncStorage.getItem(this.USER_ID_KEY);
      console.log('UserDataManager: Saved user ID retrieved:', userId ? 'exists' : 'null');
      return userId;
    } catch (error) {
      console.error('Error getting saved user ID:', error);
      return null;
    }
  }

  /**
   * Get saved Password
   * @returns {Promise<string|null>} - Saved Password or null if not found
   */
  static async getSavedPassword(): Promise<string | null> {
    try {
      console.log('UserDataManager: Getting saved password...');
      const password = await AsyncStorage.getItem(this.PASSWORD_KEY);
      console.log('UserDataManager: Saved password retrieved:', password ? 'exists' : 'null');
      return password;
    } catch (error) {
      console.error('Error getting saved password:', error);
      return null;
    }
  }

  /**
   * Get both saved credentials at once
   * @returns {Promise<{userId: string|null, password: string|null}>}
   */
  static async getSavedCredentials(): Promise<{userId: string | null, password: string | null}> {
    try {
      console.log('UserDataManager: Getting saved credentials...');
      const keys = await AsyncStorage.multiGet([this.USER_ID_KEY, this.PASSWORD_KEY]);
      const credentials = {
        userId: keys[0][1],
        password: keys[1][1]
      };
      console.log('UserDataManager: Saved credentials retrieved - userId:', credentials.userId ? 'exists' : 'null', 'password:', credentials.password ? 'exists' : 'null');
      return credentials;
    } catch (error) {
      console.error('Error getting saved credentials:', error);
      return {
        userId: null,
        password: null
      };
    }
  }

  /**
   * Clear saved credentials
   */
  static async clearSavedCredentials(): Promise<void> {
    try {
      console.log('UserDataManager: Clearing saved credentials...');
      await AsyncStorage.multiRemove([this.USER_ID_KEY, this.PASSWORD_KEY]);
      console.log('UserDataManager: Saved credentials cleared successfully');
    } catch (error) {
      console.error('Error clearing saved credentials:', error);
      throw error;
    }
  }

  /**
   * Check if credentials are saved
   * @returns {Promise<boolean>} - True if credentials exist
   */
  static async hasStoredCredentials(): Promise<boolean> {
    try {
      console.log('UserDataManager: Checking if credentials are stored...');
      const keys = await AsyncStorage.multiGet([this.USER_ID_KEY, this.PASSWORD_KEY]);
      const hasCredentials = keys[0][1] !== null && keys[1][1] !== null;
      console.log('UserDataManager: Credentials stored:', hasCredentials);
      return hasCredentials;
    } catch (error) {
      console.error('Error checking stored credentials:', error);
      return false;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      console.log('UserDataManager: Clearing all data...');
      await AsyncStorage.multiRemove([
        this.USER_DATA_KEY,
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
        this.IS_LOGGED_IN_KEY,
        this.USER_ID_KEY,
        this.PASSWORD_KEY
      ]);
      console.log('UserDataManager: All data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    try {
      console.log('UserDataManager: Checking login status...');
      const loginState = await this.getLoginState();
      const userData = await this.getUserData();
      console.log('UserDataManager: loginState:', loginState, 'userData exists:', !!userData);
      
      // Consider logged in if we have login state true AND user data
      const isLoggedIn = loginState && !!userData;
      console.log('UserDataManager: Is logged in:', isLoggedIn);
      return isLoggedIn;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Clear only session data (keep credentials for auto-login)
   */
  static async clearSessionData(): Promise<void> {
    try {
      console.log('UserDataManager: Clearing session data (keeping credentials)...');
      await AsyncStorage.multiRemove([
        this.USER_DATA_KEY,
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
        this.IS_LOGGED_IN_KEY
      ]);
      console.log('UserDataManager: Session data cleared successfully');
    } catch (error) {
      console.error('Error clearing session data:', error);
      throw error;
    }
  }

  /**
   * Auto-login using saved credentials
   * @returns {Promise<{userId: string, password: string} | null>} - Credentials if available, null otherwise
   */
  static async getAutoLoginCredentials(): Promise<{userId: string, password: string} | null> {
    try {
      const hasCredentials = await this.hasStoredCredentials();
      if (!hasCredentials) {
        console.log('UserDataManager: No stored credentials for auto-login');
        return null;
      }

      const credentials = await this.getSavedCredentials();
      if (credentials.userId && credentials.password) {
        console.log('UserDataManager: Auto-login credentials retrieved');
        return {
          userId: credentials.userId,
          password: credentials.password
        };
      }
      
      console.log('UserDataManager: Incomplete credentials for auto-login');
      return null;
    } catch (error) {
      console.error('Error getting auto-login credentials:', error);
      return null;
    }
  }
}