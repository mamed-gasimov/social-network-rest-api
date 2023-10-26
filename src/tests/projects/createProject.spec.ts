import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { Project as projectModel } from '@models/project.model';
import { ROUTES, mockResponseUser, mockCreateProjectPayload } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

const foundUser = { ...mockResponseUser, role: UserRole.Admin } as userModel;
const foundProject = { ...mockCreateProjectPayload, id: 1 };

describe('POST create project', () => {
  it('should return successfully created project', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(foundUser);
    jest.spyOn(projectModel, 'create').mockResolvedValueOnce(foundProject);

    const response = await supertest(app).post(ROUTES.project.main).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.CREATED);
    expect(response.body).toEqual(foundProject);
  });

  it('should return "You can not create project for another user" and 403 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.User } as userModel);
    jest.spyOn(projectModel, 'create').mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1 });

    const response = await supertest(app).post(ROUTES.project.main).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'You can not create project for another user' });
  });

  it('should return "User was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).post(ROUTES.project.main).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User was not found' });
  });

  describe('Value is required', () => {
    it('should return ""userId" is required" and 400 status code', async () => {
      const payload = { ...mockCreateProjectPayload };
      delete payload.userId;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.project.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"userId" is required' });
    });

    it('should return ""description" is required" and 400 status code', async () => {
      const payload = { ...mockCreateProjectPayload };
      delete payload.description;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.project.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"description" is required' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const payload = { ...mockCreateProjectPayload, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).post(ROUTES.project.main).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).post(ROUTES.project.main).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
