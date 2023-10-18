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
} from '@middleware/validation';
import {
  createExperienceController,
  getExperiencesContoller,
  getExperienceContoller,
  updateExperienceController,
  deleteExperienceController,
} from '@controllers/index';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';
import { allowedKeysForGetExperiences } from '@interfaces/experience/getExperinces';

export const makeExperienceRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin, UserRole.User]),
    checkForAllowedFields(allowedKeysForCreateExperience),
    createExperienceValidationSchema,
    createExperienceController(context),
  );

  router.get('/:id', logRequestId, paramIdValidationSchema, getExperienceContoller(context));

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetExperiences, true),
    queryForPaginationValidationSchema,
    getExperiencesContoller(context),
  );

  router.put(
    '/:id',
    logRequestId,
    [...paramIdValidationSchema, ...createExperienceValidationSchema],
    updateExperienceController(context),
  );

  router.delete('/:id', logRequestId, paramIdValidationSchema, deleteExperienceController(context));

  return router;
};
