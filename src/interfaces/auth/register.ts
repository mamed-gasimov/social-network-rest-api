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
