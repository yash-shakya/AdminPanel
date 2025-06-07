export interface UserAuthResponse {
  success: true;
  onBoard: true;
  data: {
    user: {
      email: string;
      name: string;
      picture: string;
      onBoard: boolean;
      college: string;
      year: string;
      admin: boolean;
      role: string;
    };
    token: string;
  };
}

export interface IdToken {
    idToken:string;
}

export interface UserProfileUpdateSchema {
    year:string;
    phone: string;
    college: string;
}