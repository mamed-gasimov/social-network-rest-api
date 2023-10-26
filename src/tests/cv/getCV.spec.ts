import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockUser, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';
import { redisClient } from '@services/cache/base.cache';
import { CVResponse } from '@interfaces/cv';

describe('GET user cv', () => {
  const authorizedUser = { ...mockResponseUser, id: 1, role: UserRole.User };
  const cv: CVResponse = {
    ...mockResponseUser,
    id: `${mockResponseUser.id}`,
    image: '',
    experiences: [],
    projects: [],
    feedbacks: [],
  };

  it('should return cv from redis cache', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(authorizedUser as userModel);
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(JSON.stringify(cv));

    const response = await supertest(app).get(ROUTES.cv.main).send();

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual(cv);
  });

  it('should return cv from db', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(authorizedUser as userModel);
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(null);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(cv as never);
    jest.spyOn(redisClient, 'set').mockResolvedValueOnce('');

    const response = await supertest(app).get(ROUTES.cv.main).send();

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual(cv);
  });

  it('should return "User was not found" and 400 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(authorizedUser as userModel);
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(null);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).get(ROUTES.cv.main).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User was not found' });
  });
});
