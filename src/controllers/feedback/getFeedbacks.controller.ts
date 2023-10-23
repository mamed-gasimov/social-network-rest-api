import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetResourceRequestQuery } from '@interfaces/paginationQuery';
import { allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';
import { CustomError } from '@helpers/customError';

const getFeedbacksController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query as unknown as GetResourceRequestQuery;

      const {
        services: { feedbackService },
      } = context;

      const selectFields = ['id', ...Object.keys(allowedKeysForCreateFeedback)];
      const skip = (page - 1) * pageSize;
      const { rows, count } = await feedbackService.getFeedbacks(selectFields, +skip, +pageSize);

      logger.info('List of feedbacks was successfully returned');
      return res.status(HTTP_STATUSES.OK).header('X-total-count', `${count}`).json(rows);
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default getFeedbacksController;
