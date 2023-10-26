import supertest from 'supertest';
import bcrypt from 'bcrypt';

import { HTTP_STATUSES } from '@interfaces/general';
import { User as userModel } from '@models/user.model';
import { ROUTES, mockResponseUser, mockUser } from '../mocks';
import { app } from '../testSetupFile';

describe('POST auth register', () => {
  it('should return a valid user upon successful registration', async () => {
    const userPayload = { ...mockUser };
    const responsePayload = { ...mockResponseUser, image: 'default.png', id: '12' };

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('test' as never);
    jest.spyOn(userModel, 'create').mockResolvedValueOnce(responsePayload);

    const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

    expect(response.status).toEqual(HTTP_STATUSES.CREATED);
    expect(response.body).toEqual(responsePayload);
  });

  it('should return "The user with the current email already exists." and 400 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockResponseUser as userModel);

    const response = await supertest(app).post(ROUTES.auth.register).send(mockUser);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'The user with the current email already exists.' });
  });

  describe('Value is required', () => {
    it('should return ""firstName" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.firstName;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"firstName" is required' });
    });

    it('should return ""lastName" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.lastName;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"lastName" is required' });
    });

    it('should return ""summary" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.summary;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"summary" is required' });
    });

    it('should return ""title" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.title;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"title" is required' });
    });

    it('should return ""password" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.password;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"password" is required' });
    });

    it('should return ""email" is required" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      delete userPayload.email;
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"email" is required' });
    });
  });

  describe('Length validations', () => {
    it('should return ""password" length should be between 8 and 15 characters" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.password = '11';
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"password" length should be between 8 and 15 characters' });
    });

    it('should return "Length of "firstName" should be between 2 and 30 characters" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.firstName = 't'.repeat(31);
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: 'Length of "firstName" should be between 2 and 30 characters' });
    });

    it('should return "Length of "lastName" should be between 2 and 30 characters" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.lastName = 't'.repeat(31);
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: 'Length of "lastName" should be between 2 and 30 characters' });
    });

    it('should return "Length of "title" should be between 2 and 255 characters" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.title = 't'.repeat(256);
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: 'Length of "title" should be between 2 and 255 characters' });
    });

    it('should return "Length of "summary" should be between 2 and 255 characters" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.summary = 't'.repeat(256);
      const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: 'Length of "summary" should be between 2 and 255 characters' });
    });
  });

  it('should return "Invalid email" and 400 status code', async () => {
    const userPayload = { ...mockUser };
    userPayload.email = 'test';
    const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid email' });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const userPayload = { ...mockUser, someOtherField: 10 };
    const response = await supertest(app).post(ROUTES.auth.register).send(userPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });
});
