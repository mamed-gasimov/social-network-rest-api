export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    summary: string;
    email: string;
    image: string;
  };
  token: string;
}

export const allowedKeysForLogin = {
  email: 1,
  password: 2,
};
