import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import {
  checkForAllowedFields,
  createExperienceValidationSchema,
  queryForPaginationValidationSchema,
  paramIdValidationSchema,
  validate,
} from '@middleware/validation';
import {
  createExperienceController,
  getExperiencesContoller,
  getExperienceContoller,
  updateExperienceController,
  deleteExperienceController,
} from '@controllers/index';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';
import { allowedKeysForGetResourceWithPagination } from '@interfaces/paginationQuery';

export const makeExperienceRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin, UserRole.User]),
    checkForAllowedFields(allowedKeysForCreateExperience),
    createExperienceValidationSchema,
    validate,
    createExperienceController(context),
  );

  router.get('/:id', logRequestId, paramIdValidationSchema, validate, getExperienceContoller(context));

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetResourceWithPagination, true),
    queryForPaginationValidationSchema,
    validate,
    getExperiencesContoller(context),
  );

  router.put(
    '/:id',
    logRequestId,
    checkForAllowedFields(allowedKeysForCreateExperience),
    [...paramIdValidationSchema, ...createExperienceValidationSchema],
    validate,
    updateExperienceController(context),
  );

  router.delete('/:id', logRequestId, paramIdValidationSchema, validate, deleteExperienceController(context));

  return router;
};
