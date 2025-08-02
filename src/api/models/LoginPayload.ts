export default class LoginPayload {
  User_ID: string;
  User_Password: string;
  Auth_Token: string;
  Customer_Code: string;
  C_User_ID: string | null;
  C_Password: string | null;

  constructor(userId: string, password: string) {
    this.User_ID = "BOPEXA1";
    this.User_Password = "BOPExA1@712025";
    this.Auth_Token = "BOpExA1547";
    this.Customer_Code = "10002";
    this.C_User_ID = userId;
    this.C_Password = password;
  }
}