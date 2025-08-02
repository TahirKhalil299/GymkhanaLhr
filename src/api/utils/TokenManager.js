import AsyncStorage from '@react-native-async-storage/async-storage';

export default class TokenManager {
  static async getAccessToken() {
    return await AsyncStorage.getItem('accessToken');
  }

  static async getRefreshToken() {
    return await AsyncStorage.getItem('refreshToken');
  }

  static async saveTokens({ accessToken, refreshToken }) {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken]
    ]);
  }

  static async clearTokens() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }
}