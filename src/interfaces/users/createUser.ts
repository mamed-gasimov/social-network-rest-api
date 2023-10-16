import { RegisterRequestBody } from '@interfaces/auth/register';
import { UserRole } from '@models/user.model';

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
