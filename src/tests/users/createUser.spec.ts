import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockResponseUser, mockResponseNewUser, payloadCreateUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('POST create user', () => {
  it('should return successfully created user and 201 status code', async () => {
    const payload = { ...payloadCreateUser };
    payload.email = mockResponseNewUser.email;

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockResponseNewUser);

    const response = await supertest(app).post(ROUTES.user.main).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.CREATED);
    expect(response.body).toEqual({ ...mockResponseNewUser, role: UserRole.User });
  });

  it('should return "The user with the current email already exists." and 400 status code', async () => {
    const payload = { ...payloadCreateUser };
    payload.email = mockResponseNewUser.email;

    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);

    const response = await supertest(app).post(ROUTES.user.main).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'The user with the current email already exists.' });
  });

  describe('Value is required', () => {
    it('should return ""firstName" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.firstName;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"firstName" is required' });
    });

    it('should return ""lastName" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.lastName;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"lastName" is required' });
    });

    it('should return ""summary" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.summary;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"summary" is required' });
    });

    it('should return ""title" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.title;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"title" is required' });
    });

    it('should return ""password" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.password;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"password" is required' });
    });

    it('should return ""email" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.email;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"email" is required' });
    });

    it('should return ""role" is required" and 400 status code', async () => {
      const userPayload = { ...payloadCreateUser };
      delete userPayload.role;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
      const response = await supertest(app).post(ROUTES.user.main).send(userPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"role" is required' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const payload = { ...payloadCreateUser, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).post(ROUTES.project.main).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).post(ROUTES.user.main).send(payloadCreateUser);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
