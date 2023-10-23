import { RegisterRequestBody } from '@interfaces/auth/register';
import { UserRole } from '@models/user.model';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  title: string;
  summary: string;
  role: UserRole;
  email: string;
  password: string;
}

export interface CreateUserRequestBody extends RegisterRequestBody {
  role: UserRole;
  image?: string;
}

export interface CreateUserResponseBody {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email: string;
  role: string;
}

export const allowedKeysForCreateUser = {
  email: 1,
  password: 2,
  firstName: 3,
  lastName: 4,
  title: 5,
  summary: 6,
  role: 7,
};
