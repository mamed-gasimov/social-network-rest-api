import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';

const getFeedbackController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      services: { feedbackService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateFeedback)];
    const foundFeedback = await feedbackService.getFeedbackById(selectFields, +req.params.id);
    if (!foundFeedback) {
      logger.error('Feedback was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Feedback was not found' });
    }

    logger.info('Feedback was found successfully');
    return res.status(HTTP_STATUSES.OK).json(foundFeedback);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getFeedbackController;
