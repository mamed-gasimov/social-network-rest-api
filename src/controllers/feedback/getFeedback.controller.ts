import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';
import { CustomError } from '@helpers/customError';

const getFeedbackController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      services: { feedbackService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateFeedback)];
    const foundFeedback = await feedbackService.getFeedbackById(selectFields, +req.params.id);
    if (!foundFeedback) {
      const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Feedback was not found');
      return next(err);
    }

    logger.info('Feedback was found successfully');
    return res.status(HTTP_STATUSES.OK).json(foundFeedback);
  } catch (error) {
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default getFeedbackController;
