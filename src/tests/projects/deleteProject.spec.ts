import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { Project as projectModel } from '@models/project.model';
import { ROUTES, mockCreateProjectPayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('DELETE project by id', () => {
  it('should return an empty object and 204 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest
      .spyOn(projectModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1 } as unknown as projectModel);

    const response = await supertest(app).delete(ROUTES.project.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.DELETED);
    expect(response.body).toEqual({});
  });

  it('should return "Only admin can delete project created by another user." and 403 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest
      .spyOn(projectModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateProjectPayload, id: 1, userId: 10 } as unknown as projectModel);

    const response = await supertest(app).delete(ROUTES.project.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'Only admin can delete project created by another user.' });
  });

  it('should return "Project was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(projectModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).delete(ROUTES.project.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'Project was not found' });
  });

  it('should return "Invalid value"" and 400 status code when id in route params is not a positive integer', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);

    const response = await supertest(app)
      .delete(ROUTES.project.withIdParam + 'test')
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid value' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).delete(ROUTES.project.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
