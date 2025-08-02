export interface ILoginResponse {
  StatusDesc: string;
  StatusCode: string;
  data?: IUserData;
}

export interface IUserData {
  C_User_ID?: string;
  C_Email?: string;
  C_Title?: string;
  C_Name?: string;
  C_FName?: string;
  C_Add1?: string;
  C_City?: string;
  C_Province?: string;
  C_Country?: string;
  C_Tel_Mobile?: string;
  C_Gender?: string;
  CType?: string;
  C_ITypeID?: string;
  CStatus?: string;
  C_Nationality?: string;
  C_Occupation_Cat?: string;
  C_Occupation?: string;
  C_DOB?: string;
  C_BirthPlace?: string;
  C_IType_Expiry?: string;
  C_Complete?: string;
  C_ITypeRef?: string;
  Img_D?: string;
}

export default class LoginResponse implements ILoginResponse {
  StatusDesc: string;
  StatusCode: string;
  data?: IUserData;

  constructor(data: ILoginResponse) {
    this.StatusDesc = data.StatusDesc || '';
    this.StatusCode = data.StatusCode || '';
    this.data = data.data || null;
  }

  isSuccess(): boolean {
    return this.StatusDesc === 'Success';
  }

  getUserData(): IUserData | null {
    return this.data || null;
  }

  getStatusMessage(): string {
    return this.StatusDesc || 'Unknown status';
  }
}