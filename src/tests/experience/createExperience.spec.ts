import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockCreateExperiencePayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('POST create experience', () => {
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
});
