import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { Experience as experienceModel } from '@models/experience.model';
import { ROUTES, mockCreateExperiencePayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('DELETE delete experience', () => {
  it('should return an empty object and 204 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest
      .spyOn(experienceModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateExperiencePayload, id: 1 } as unknown as experienceModel);

    const response = await supertest(app)
      .delete(ROUTES.experience.withIdParam)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.DELETED);
    expect(response.body).toEqual({});
  });

  it('should return "Only admin can delete experience created by another user." and 403 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest
      .spyOn(experienceModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateExperiencePayload, id: 1, userId: 10 } as unknown as experienceModel);

    const response = await supertest(app)
      .delete(ROUTES.experience.withIdParam)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'Only admin can delete experience created by another user.' });
  });

  it('should return "Experience was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(experienceModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app)
      .delete(ROUTES.experience.withIdParam)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'Experience was not found' });
  });

  it('should return "Invalid value"" and 400 status code when id in route params is not a positive integer', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);

    const response = await supertest(app)
      .delete(ROUTES.experience.withIdParam + 'test')
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid value' });
  });
});
