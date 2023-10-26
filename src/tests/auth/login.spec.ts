import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { HTTP_STATUSES } from '@interfaces/general';
import { User as userModel } from '@models/user.model';
import { ROUTES, mockLoginPayload, mockResponseUser } from '../mocks';
import { app } from '../testSetupFile';

describe('POST auth login', () => {
  it('should return a valid user and token upon successful login', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockResponseUser as userModel);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
    jest.spyOn(jwt, 'sign').mockReturnValue('mockToken' as unknown as void);

    const response = await supertest(app).post(ROUTES.auth.login).send(mockLoginPayload);

    expect(response.status).toBe(HTTP_STATUSES.OK);
    expect(response.body.user).toEqual(mockResponseUser);
    expect(response.body.token).toBe('mockToken');
  });

  it('should return "Invalid credentials" message with 400 error when user with provided email not found', async () => {
    const loginPayload = { ...mockLoginPayload };
    loginPayload.email = 'some@t.com';

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

    const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });

  it('should return "Invalid credentials" message with 400 error when passwords do not match', async () => {
    const loginPayload = { ...mockLoginPayload };
    loginPayload.password = '12345678';

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockResponseUser as userModel);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

    const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });

  describe('Value is required', () => {
    it('should return ""email" is required" and 400 status code', async () => {
      const loginPayload = { ...mockLoginPayload };
      loginPayload.email = '';

      const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"email" is required' });
    });

    it('should return ""password" is required" and 400 status code', async () => {
      const loginPayload = { ...mockLoginPayload };
      delete loginPayload.password;

      const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"password" is required' });
    });
  });

  it('should return ""password" length should be between 8 and 15 characters" and 400 status code', async () => {
    const loginPayload = { ...mockLoginPayload };
    loginPayload.password = '11';
    const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: '"password" length should be between 8 and 15 characters' });
  });

  it('should return "Invalid email" and 400 status code', async () => {
    const loginPayload = { ...mockLoginPayload };
    loginPayload.email = 'test';
    const response = await supertest(app).post(ROUTES.auth.register).send(loginPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid email' });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const loginPayload = { ...mockLoginPayload, someOtherField: 10 };
    const response = await supertest(app).post(ROUTES.auth.login).send(loginPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });
});
