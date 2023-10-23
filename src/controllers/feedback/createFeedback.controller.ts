import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateFeedbackRequestBody } from '@interfaces/feedback/createFeedback';
import { CustomError } from '@helpers/customError';

const createFeedbackController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const { id: currentUserId } = req.user as { id: number };
      if (currentUserId !== +req.body.fromUser || +req.body.fromUser === +req.body.toUser) {
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Forbidden action');
        return next(err);
      }

      const {
        services: { feedbackService, authService },
      } = context;

      const foundToUser = await authService.findUserById(req.body.toUser);

      if (!foundToUser) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'User was not found');
        return next(err);
      }

      const { fromUser, companyName, toUser, context: feedbackDescription } = req.body as CreateFeedbackRequestBody;
      const newFeedback = { companyName, context: feedbackDescription, toUser, fromUser };
      const { id } = await feedbackService.createFeedback(newFeedback);

      logger.info('Feedback was successfully created');
      return res.status(HTTP_STATUSES.CREATED).json({ id, ...newFeedback });
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default createFeedbackController;
