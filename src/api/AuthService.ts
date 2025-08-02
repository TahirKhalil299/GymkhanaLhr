import RequestType from './RequestTypes';
import ServiceProvider, { ApiListener } from './ServiceProvider';
import { ENDPOINTS } from './constants';
import LoginResponse from './models/LoginResponse';

export default class AuthService extends ServiceProvider {
  async login(
    userId: string, 
    password: string, 
    listener?: ApiListener
  ): Promise<LoginResponse> {
    // Create payload matching the actual API structure
    const payload = {
      C_Password: password,
      C_User_ID: userId,
      Auth_Token: "BOpExA1547",
      Customer_Code: "10002",
      User_ID: "BOPEXA1",
      User_Password: "BOPExA1@712025"
    };
    
    const response = await this.request(
      'post',
      ENDPOINTS.AUTH.LOGIN,
      payload,
      RequestType.LOGIN,
      listener
    );
    
    return new LoginResponse(response.data);
  }

  async logout(listener?: ApiListener): Promise<void> {
    await this.request(
      'post',
      ENDPOINTS.AUTH.LOGOUT,
      undefined,
      RequestType.LOGOUT,
      listener
    );
  }

  async refreshToken(token: string, listener?: ApiListener): Promise<any> {
    const response = await this.request(
      'post',
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      { token },
      RequestType.REFRESH_TOKEN,
      listener
    );
    
    return response.data;
  }
}