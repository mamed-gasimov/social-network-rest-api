export interface GetResourceRequestQuery {
  pageSize: number;
  page: number;
}

export const allowedKeysForGetResourceWithPagination = {
  pageSize: 1,
  page: 2,
};
