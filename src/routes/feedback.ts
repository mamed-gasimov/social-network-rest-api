import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import { allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';
import {
  checkForAllowedFields,
  createFeedbackValidationSchema,
  paramIdValidationSchema,
  queryForPaginationValidationSchema,
} from '@middleware/validation';
import { createFeedbackController } from '@controllers/index';

export const makeFeedbackRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin, UserRole.User]),
    checkForAllowedFields(allowedKeysForCreateFeedback),
    createFeedbackValidationSchema,
    createFeedbackController(context),
  );

  router.get('/', logRequestId, roles([UserRole.Admin]), queryForPaginationValidationSchema);
  router.get('/:id', logRequestId, paramIdValidationSchema);

  router.put('/:id', logRequestId, [...paramIdValidationSchema, ...createFeedbackValidationSchema]);

  router.delete('/:id', logRequestId, paramIdValidationSchema);

  return router;
};
