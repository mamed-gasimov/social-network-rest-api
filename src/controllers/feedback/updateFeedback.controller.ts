import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CreateFeedbackRequestBody, allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';

const updateFeedbackController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      services: { feedbackService },
    } = context;

    const { fromUser, companyName, toUser, context: feedbackDescription } = req.body as CreateFeedbackRequestBody;

    const { id, role: userRole } = req.user as { id: number; role: UserRole };
    if (+fromUser !== id && userRole !== UserRole.Admin) {
      logger.error("Forbidden action. Only admin can update other user's feedback.");
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: "Only admin can update other user's feedback." });
    }

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateFeedback)];
    const foundFeedback = await feedbackService.getFeedbackById(selectFields, +req.params.id);

    if (!foundFeedback) {
      logger.error('Feedback was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Feedback was not found' });
    }

    if (foundFeedback.fromUser !== +fromUser || foundFeedback.toUser !== +toUser) {
      logger.error('Forbidden action. You can not change neither "fromUser" nor "toUser" fields');
      return res
        .status(HTTP_STATUSES.FORBIDDEN)
        .json({ message: 'You can not change neither "fromUser" nor "toUser" fields' });
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
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default updateFeedbackController;
