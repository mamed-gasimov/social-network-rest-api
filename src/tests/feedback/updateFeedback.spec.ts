import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { FeedBack as feedbackModel } from '@models/feedback.model';
import { ROUTES, mockCreateFeedbackPayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('PUT update feedback', () => {
  it('should return successfully updated feedback object and 200 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.Admin } as userModel);
    jest
      .spyOn(feedbackModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateFeedbackPayload, id: 1 } as unknown as feedbackModel);
    //@ts-ignore
    jest.spyOn(feedbackModel, 'update').mockResolvedValueOnce([1, { ...mockCreateFeedbackPayload, id: 1 }]);

    const response = await supertest(app).put(ROUTES.feedback.withIdParam).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual({ ...mockCreateFeedbackPayload, id: 1 });
  });

  it('should return "Only admin can update feedback created by another user." and 403 status code', async () => {
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValue({ ...mockResponseUser, id: 10, role: UserRole.User } as userModel);
    jest
      .spyOn(feedbackModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateFeedbackPayload, id: 1 } as unknown as feedbackModel);
    // @ts-ignore
    jest.spyOn(feedbackModel, 'update').mockResolvedValueOnce([1, { ...mockCreateFeedbackPayload, id: 1 }]);

    const response = await supertest(app).put(ROUTES.feedback.withIdParam).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'Only admin can update feedback created by another user.' });
  });

  it('should return "You can not change neither "fromUser" nor "toUser" fields" and 403 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest
      .spyOn(feedbackModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateFeedbackPayload, id: 1 } as unknown as feedbackModel);

    const response = await supertest(app)
      .put(ROUTES.feedback.withIdParam)
      .send({ ...mockCreateFeedbackPayload, fromUser: 13 });

    expect(response.status).toEqual(HTTP_STATUSES.FORBIDDEN);
    expect(response.body).toEqual({ message: 'You can not change neither "fromUser" nor "toUser" fields' });
  });

  it('should return "Feedback was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(feedbackModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).put(ROUTES.feedback.withIdParam).send(mockCreateFeedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'Feedback was not found' });
  });

  describe('Value is required', () => {
    it('should return ""companyName" is required" and 400 status code', async () => {
      const feedbackPayload = { ...mockCreateFeedbackPayload };
      delete feedbackPayload.companyName;
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);

      const response = await supertest(app).put(ROUTES.feedback.withIdParam).send(feedbackPayload);

      expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
      expect(response.body).toEqual({ message: '"companyName" is required' });
    });
  });

  it('should return "Invalid fields" and 400 status code', async () => {
    const feedbackPayload = { ...mockCreateFeedbackPayload, someOtherField: 10 };
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    const response = await supertest(app).put(ROUTES.feedback.withIdParam).send(feedbackPayload);

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid fields' });
  });
});
