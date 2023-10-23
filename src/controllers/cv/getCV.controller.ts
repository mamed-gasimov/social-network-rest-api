import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CVResponse, UserCV } from '@interfaces/cv';

const getCVController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const { userId } = req.params as unknown as { userId: number };
    const {
      services: { usersService },
    } = context;

    const foundUser: UserCV = (await usersService.getUserCV(userId)) as UserCV;
    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { id, firstName, lastName, title, summary, email, image, experiences, feedbacks, projects } = foundUser;
    const response: CVResponse = {
      id: `${id}`,
      firstName,
      lastName,
      title,
      summary,
      email,
      image,
      experiences,
      feedbacks,
      projects,
    };

    logger.info('CV was returned successfully');
    return res.status(HTTP_STATUSES.OK).json(response);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getCVController;
