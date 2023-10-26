import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { FeedBack as feedbackModel } from '@models/feedback.model';
import { ROUTES, mockResponseUser, mockCreateFeedbackPayload } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

const foundUser = { ...mockResponseUser, role: UserRole.Admin } as userModel;
const foundFeedback = { ...mockCreateFeedbackPayload, id: 1 };

describe('POST create feedback', () => {
  it('should return successfully created feedback', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(foundUser);
    jest.spyOn(feedbackModel, 'create').mockResolvedValueOnce(foundFeedback);

    const response = await supertest(app).post(ROUTES.feedback.main).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.CREATED);
    expect(response.body).toEqual(foundFeedback);
  });

  it('should return "Forbidden action" and 403 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.User } as userModel);
    jest.spyOn(feedbackModel, 'create').mockResolvedValueOnce({ ...mockCreateFeedbackPayload, id: 1 });

    const response = await supertest(app).post(ROUTES.feedback.main).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'Forbidden action' });
  });

  it('should return "User was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).post(ROUTES.feedback.main).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User was not found' });
  });

  describe('Value is required', () => {
    it('should return ""fromUser" is required" and 400 status code', async () => {
      const payload = { ...mockCreateFeedbackPayload };
      delete payload.fromUser;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.feedback.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"fromUser" is required' });
    });

    it('should return ""companyName" is required" and 400 status code', async () => {
      const payload = { ...mockCreateFeedbackPayload };
      delete payload.companyName;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.feedback.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"companyName" is required' });
    });

    it('should return ""toUser" is required" and 400 status code', async () => {
      const payload = { ...mockCreateFeedbackPayload };
      delete payload.toUser;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.feedback.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"toUser" is required' });
    });

    it('should return ""context" is required" and 400 status code', async () => {
      const payload = { ...mockCreateFeedbackPayload };
      delete payload.context;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).post(ROUTES.feedback.main).send(payload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"context" is required' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const payload = { ...mockCreateFeedbackPayload, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).post(ROUTES.feedback.main).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).post(ROUTES.feedback.main).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
