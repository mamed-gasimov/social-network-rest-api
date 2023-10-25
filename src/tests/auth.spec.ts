import { Express } from 'express';
import supertest from 'supertest';

import { loadApp } from '@loaders/app';
import { HTTP_STATUSES } from '@interfaces/general';
import { mockUser } from './mocks';

jest.useFakeTimers();
jest.mock('@models/user.model.ts');
jest.mock('@models/experience.model.ts');
jest.mock('@models/feedback.model.ts');
jest.mock('@models/project.model.ts');

const registerRoute = '/api/auth/register';
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
        const response = await supertest(app).post(registerRoute).send(userPayload);

        expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
        expect(response.body).toEqual({ message: '"firstName" is required' });
      });

      it('should return ""lastName" is required" and 400 status code', async () => {
        const userPayload = { ...mockUser };
        delete userPayload.lastName;
        const response = await supertest(app).post(registerRoute).send(userPayload);

        expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
        expect(response.body).toEqual({ message: '"lastName" is required' });
      });

      it('should return ""summary" is required" and 400 status code', async () => {
        const userPayload = { ...mockUser };
        delete userPayload.summary;
        const response = await supertest(app).post(registerRoute).send(userPayload);

        expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
        expect(response.body).toEqual({ message: '"summary" is required' });
      });

      it('should return ""title" is required" and 400 status code', async () => {
        const userPayload = { ...mockUser };
        delete userPayload.title;
        const response = await supertest(app).post(registerRoute).send(userPayload);

        expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
        expect(response.body).toEqual({ message: '"title" is required' });
      });
    });
  });

  describe('Length validations', () => {
    it('should return ""Password" length should be between 8 and 15 charactes" and 400 status code', async () => {
      const userPayload = { ...mockUser };
      userPayload.password = '11';
      const response = await supertest(app).post(registerRoute).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"Password" length should be between 8 and 15 charactes' });
    });
  });
});
