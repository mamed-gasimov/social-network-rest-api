import { Express } from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { loadApp } from '@loaders/app';
import { HTTP_STATUSES } from '@interfaces/general';
import { ROUTES, mockUser, mockLoginPayload, mockResponseUser } from './mocks';
import { User as userModel } from '@models/user.model';

jest.useFakeTimers();
jest.mock('@models/user.model.ts');
jest.mock('@models/experience.model.ts');
jest.mock('@models/feedback.model.ts');
jest.mock('@models/project.model.ts');

const PORT = 3001;

describe('Auth endpoints', () => {
  let app: Express;
  beforeAll(async () => {
    app = await loadApp();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    app.listen(PORT).close();
  });

  describe('POST auth register', () => {
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
  });

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
  });
});
