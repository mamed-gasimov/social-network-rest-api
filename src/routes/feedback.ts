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
  validate,
} from '@middleware/validation';
import {
  createFeedbackController,
  getFeedbackController,
  getFeedbacksController,
  deleteFeedbackController,
  updateFeedbackController,
} from '@controllers/index';
import { allowedKeysForGetResourceWithPagination } from '@interfaces/paginationQuery';

export const makeFeedbackRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin, UserRole.User]),
    checkForAllowedFields(allowedKeysForCreateFeedback),
    createFeedbackValidationSchema,
    validate,
    createFeedbackController(context),
  );

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetResourceWithPagination, true),
    queryForPaginationValidationSchema,
    validate,
    getFeedbacksController(context),
  );
  router.get('/:id', logRequestId, paramIdValidationSchema, validate, getFeedbackController(context));

  router.put(
    '/:id',
    logRequestId,
    checkForAllowedFields(allowedKeysForCreateFeedback),
    [...paramIdValidationSchema, ...createFeedbackValidationSchema],
    validate,
    updateFeedbackController(context),
  );

  router.delete('/:id', logRequestId, paramIdValidationSchema, validate, deleteFeedbackController(context));

  return router;
};
