import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { Project as projectModel } from '@models/project.model';
import { ROUTES, mockCreateProjectPayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('PUT update project', () => {
  it('should return successfully updated project object and 200 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.Admin } as userModel);
    jest
      .spyOn(projectModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1 } as unknown as projectModel);
    //@ts-ignore
    jest.spyOn(projectModel, 'update').mockResolvedValueOnce([1, { ...mockCreateProjectPayload, id: 1 }]);

    const response = await supertest(app).put(ROUTES.project.withIdParam).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual({ ...mockCreateProjectPayload, id: 1 });
  });

  it('should return "Only admin can update project created by another user." and 403 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.User } as userModel);
    jest
      .spyOn(projectModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1 } as unknown as projectModel);
    // @ts-ignore
    jest.spyOn(projectModel, 'update').mockResolvedValueOnce([1, { ...mockCreateProjectPayload, id: 1 }]);

    const response = await supertest(app).put(ROUTES.project.withIdParam).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'Only admin can update project created by another user.' });
  });

  it('should return "You can not change "userID" field." and 403 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest
      .spyOn(projectModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1 } as unknown as projectModel);

    const response = await supertest(app)
      .put(ROUTES.project.withIdParam)
      .send({ ...mockCreateProjectPayload, userId: 13 });

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'You can not change "userId" field.' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).put(ROUTES.project.withIdParam).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });

  it('should return "Project was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(projectModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).put(ROUTES.project.withIdParam).send(mockCreateProjectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'Project was not found' });
  });

  describe('Value is required', () => {
    it('should return ""userId" is required" and 400 status code', async () => {
      const projectPayload = { ...mockCreateProjectPayload };
      delete projectPayload.userId;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).put(ROUTES.project.withIdParam).send(projectPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"userId" is required' });
    });

    it('should return ""description" is required" and 400 status code', async () => {
      const projectPayload = { ...mockCreateProjectPayload };
      delete projectPayload.description;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).put(ROUTES.project.withIdParam).send(projectPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"description" is required' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const projectPayload = { ...mockCreateProjectPayload, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).put(ROUTES.project.withIdParam).send(projectPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });
});
