export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email: string;
  password: string;
}

export interface RegisterResponseBody {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email: string;
  image: string;
}

export const allowedKeysForRegister = {
  email: 1,
  password: 2,
  firstName: 3,
  lastName: 4,
  title: 5,
  summary: 6,
};
