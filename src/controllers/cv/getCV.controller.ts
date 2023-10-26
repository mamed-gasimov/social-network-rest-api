import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CVResponse, UserCV } from '@interfaces/cv';
import { CustomError } from '@helpers/customError';
import { redisClient } from '@services/cache/base.cache';

const getCVController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params as unknown as { userId: number };
    const {
      services: { usersService },
    } = context;

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const userCVFromCache = await redisClient.get(`capstone-project-user-${userId}`);
    let response: CVResponse;
    if (userCVFromCache) {
      response = JSON.parse(userCVFromCache);
      logger.info('CV was returned successfully from cache');
      return res.status(HTTP_STATUSES.OK).json(response);
    }

    const foundUser: UserCV = (await usersService.getUserCV(userId)) as UserCV;
    if (!foundUser) {
      const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'User was not found');
      if (process.env.NODE_ENV === 'test') {
        return res.status(err.statusCode).json({ message: err.logMessage });
      }
      return next(err);
    }

    const { id, firstName, lastName, title, summary, email, image, experiences, feedbacks, projects } = foundUser;
    response = {
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

    await redisClient.set(`capstone-project-user-${id}`, JSON.stringify(response));

    logger.info('CV was returned successfully');
    return res.status(HTTP_STATUSES.OK).json(response);
  } catch (error) {
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default getCVController;
