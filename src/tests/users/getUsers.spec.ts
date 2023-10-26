import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('GET users by pageSize and page', () => {
  it('should return list of users, 200 status code and "X-total-count" response header', async () => {
    const responsePayload = {
      rows: [{ ...mockResponseUser, id: 1 } as unknown as userModel],
      count: 1,
    };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(userModel, 'findAndCountAll').mockResolvedValueOnce(responsePayload);

    const response = await supertest(app)
      .get(`${ROUTES.user.main}?pageSize=1&page=1`)
      .set({ 'X-total-count': responsePayload.count })
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual(responsePayload.rows);
    expect(response.headers['x-total-count']).toEqual(`${responsePayload.count}`);
  });

  it('should return ""pageSize" is required" and 400 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

    const response = await supertest(app).get(`${ROUTES.user.main}?page=1`).send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: '"pageSize" is required' });
  });

  it('should return ""page" is required" and 400 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

    const response = await supertest(app).get(`${ROUTES.user.main}?pageSize=1`).send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: '"page" is required' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).get(`${ROUTES.user.main}?pageSize=1&page=1`).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
