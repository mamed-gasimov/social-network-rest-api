export interface GetUsersRequestQuery {
  pageSize: number;
  page: number;
}

export interface GetUserRequestParams {
  id: number;
}

export interface GetUserResponseBody {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email: string;
  role: string;
}

export const allowedKeysForGetUsers = {
  pageSize: 1,
  page: 2,
};
