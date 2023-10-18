import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';

const deleteFeedbackController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { feedbackService },
    } = context;

    const selectFields = ['id', 'userId'];
    const foundExperience = await feedbackService.getFeedbackById(selectFields, +req.params.id);

    if (!foundExperience) {
      logger.error('Feedback was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Feedback was not found' });
    }

    // const { id, role: userRole } = req.user as { id: number; role: UserRole };
    // if (foundExperience.userId !== id && userRole !== UserRole.Admin) {
    //   logger.error("Forbidden action. Only admin can delete other user's experience.");
    //   return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: "Only admin can delete other user's experience." });
    // }

    await feedbackService.deleteFeedbackById(+req.params.id);

    logger.info('Feedback was deleted successfully');
    return res.status(HTTP_STATUSES.DELETED).json();
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default deleteFeedbackController;
