import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { Experience as experienceModel } from '@models/experience.model';
import { ROUTES, mockCreateExperiencePayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('POST create experience', () => {
  it('should return successfully created experience', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest.spyOn(experienceModel, 'create').mockResolvedValueOnce({ ...mockCreateExperiencePayload, id: 1 });

    const response = await supertest(app)
      .post(ROUTES.experience.create)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send(mockCreateExperiencePayload);

    expect(response.status).toEqual(HTTP_STATUSES.CREATED);
    expect(response.body).toEqual({ ...mockCreateExperiencePayload, id: 1 });
  });

  it('should return "You can not create experience for another user" and 403 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.User } as userModel);
    jest.spyOn(experienceModel, 'create').mockResolvedValueOnce({ ...mockCreateExperiencePayload, id: 1 });

    const response = await supertest(app)
      .post(ROUTES.experience.create)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send(mockCreateExperiencePayload);

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'You can not create experience for another user' });
  });

  it('should return "User was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app)
      .post(ROUTES.experience.create)
      .set({
        Authorization: `Bearer mockToken`,
      })
      .send(mockCreateExperiencePayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User was not found' });
  });

  describe('Value is required', () => {
    it('should return ""companyName" is required" and 400 status code', async () => {
      const experiencePayload = { ...mockCreateExperiencePayload };
      delete experiencePayload.companyName;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app)
        .post(ROUTES.experience.create)
        .set({
          Authorization: `Bearer mockToken`,
        })
        .send(experiencePayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"companyName" is required' });
    });

    it('should return ""role" is required" and 400 status code', async () => {
      const experiencePayload = { ...mockCreateExperiencePayload };
      delete experiencePayload.role;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app)
        .post(ROUTES.experience.create)
        .set({
          Authorization: `Bearer mockToken`,
        })
        .send(experiencePayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"role" is required' });
    });
  });

  describe('Length validations', () => {
    it('should return ""role" length can not be more than 255 characters long" and 400 status code', async () => {
      const experiencePayload = { ...mockCreateExperiencePayload };
      experiencePayload.role = 't'.repeat(260);
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app)
        .post(ROUTES.experience.create)
        .set({
          Authorization: `Bearer mockToken`,
        })
        .send(experiencePayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"role" length can not be more than 255 characters long' });
    });

    it('should return ""companyName" length can not be more than 110 characters long" and 400 status code', async () => {
      const experiencePayload = { ...mockCreateExperiencePayload };
      experiencePayload.companyName = 't'.repeat(111);
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app)
        .post(ROUTES.experience.create)
        .set({
          Authorization: `Bearer mockToken`,
        })
        .send(experiencePayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"companyName" length can not be more than 110 characters long' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const experiencePayload = { ...mockCreateExperiencePayload, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).post(ROUTES.experience.create).send(experiencePayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });
});
