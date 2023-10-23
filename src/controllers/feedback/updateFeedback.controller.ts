import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CreateFeedbackRequestBody, allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';
import { CustomError } from '@helpers/customError';

const updateFeedbackController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { feedbackService },
      } = context;

      const { fromUser, companyName, toUser, context: feedbackDescription } = req.body as CreateFeedbackRequestBody;

      const { id, role: userRole } = req.user as { id: number; role: UserRole };
      if (+fromUser !== id && userRole !== UserRole.Admin) {
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Only admin can update feedback created by another user.');
        return next(err);
      }

      const selectFields = ['id', ...Object.keys(allowedKeysForCreateFeedback)];
      const foundFeedback = await feedbackService.getFeedbackById(selectFields, +req.params.id);

      if (!foundFeedback) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Feedback was not found');
        return next(err);
      }

      if (foundFeedback.fromUser !== +fromUser || foundFeedback.toUser !== +toUser) {
        const err = new CustomError(
          HTTP_STATUSES.FORBIDDEN,
          'You can not change neither "fromUser" nor "toUser" fields',
        );
        return next(err);
      }

      const updatedFeedback = {
        fromUser: foundFeedback.fromUser,
        companyName,
        toUser: foundFeedback.toUser,
        context: feedbackDescription,
      };

      await feedbackService.updateFeedback(foundFeedback.id, updatedFeedback);

      logger.info('Feedback was updated successfully');
      return res.status(HTTP_STATUSES.OK).json({ id: foundFeedback.id, ...updatedFeedback });
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default updateFeedbackController;
