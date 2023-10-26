import supertest from 'supertest';

import { HTTP_STATUSES } from '@interfaces/general';
import { UserRole, User as userModel } from '@models/user.model';
import { ROUTES, mockUser, mockResponseUser } from '@tests/mocks';
import { app } from '@tests/testSetupFile';

describe('PUT update user', () => {
  const authorizedUser = { ...mockResponseUser, id: 1, role: UserRole.User };
  const payload = { ...mockUser, role: UserRole.User };

  it('should return successfully updated user object and 200 status code', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(authorizedUser as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(authorizedUser as userModel);
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
    //@ts-ignore
    jest.spyOn(userModel, 'update').mockResolvedValueOnce([1, authorizedUser]);

    const response = await supertest(app).put(ROUTES.user.withIdParam).send(payload);

    expect(response.status).toEqual(HTTP_STATUSES.OK);
    expect(response.body).toEqual({ ...authorizedUser, id: `${authorizedUser.id}` });
  });
});
