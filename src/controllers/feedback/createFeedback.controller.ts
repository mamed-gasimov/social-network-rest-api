import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateFeedbackRequestBody } from '@interfaces/feedback/createFeedback';

const createFeedbackController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { feedbackService, authService },
    } = context;

    const foundToUser = await authService.findUserById(req.body.toUser);

    if (!foundToUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { fromUser, companyName, toUser, context: feedbackDescription } = req.body as CreateFeedbackRequestBody;
    const newFeedback = { companyName, context: feedbackDescription, toUser, fromUser };
    const createFeedback = await feedbackService.createFeedback(newFeedback);

    logger.info('Feedback was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json(createFeedback);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default createFeedbackController;
