import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockResponseNewUser, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('DELETE user by id', () => {
  it('should return an empty object and 204 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseNewUser, id: 1 } as unknown as userModel);
    jest.spyOn(userModel, 'destroy').mockResolvedValueOnce(1);

    const response = await supertest(app).delete(ROUTES.user.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.DELETED);
    expect(response.body).toEqual({});
  });

  it('should return "User was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).delete(ROUTES.user.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User was not found' });
  });

  it('should return "Invalid value"" and 400 status code when id in route params is not a positive integer', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

    const response = await supertest(app)
      .delete(ROUTES.user.withIdParam + 'test')
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid value' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).delete(ROUTES.user.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
