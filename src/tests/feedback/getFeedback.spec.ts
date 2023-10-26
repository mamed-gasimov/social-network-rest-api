import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { FeedBack as feedbackModel } from '@models/feedback.model';
import { ROUTES, mockCreateFeedbackPayload, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('GET feedback by id', () => {
  it('should return a feedback object and 200 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...mockResponseUser, role: UserRole.Admin } as userModel);
    jest
      .spyOn(feedbackModel, 'findOne')
      .mockResolvedValueOnce({ ...mockCreateFeedbackPayload, id: 1 } as unknown as feedbackModel);

    const response = await supertest(app).get(ROUTES.feedback.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual({ ...mockCreateFeedbackPayload, id: 1 });
  });

  it('should return "Feedback was not found" and 404 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);
    jest.spyOn(feedbackModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).get(ROUTES.feedback.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'Feedback was not found' });
  });

  it('should return "Invalid value"" and 400 status code when id in route params is not a positive integer', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce({ ...mockResponseUser, role: UserRole.User } as userModel);

    const response = await supertest(app)
      .get(ROUTES.feedback.withIdParam + 'test')
      .send();

    expect(response.status).toEqual(HTTP_STATUSES.BAD_REQUEST);
    expect(response.body).toEqual({ message: 'Invalid value' });
  });

  it('should return an empty object and 401 status code when not authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app).get(ROUTES.feedback.withIdParam).send();

    expect(response.status).toEqual(HTTP_STATUSES.NOT_AUTHORIZED);
    expect(response.body).toEqual({});
  });
});
