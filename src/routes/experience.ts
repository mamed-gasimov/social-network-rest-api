import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import {
  checkForAllowedFields,
  createExperienceValidationSchema,
  getExperiencesValidationSchema,
  paramIdValidationSchema,
} from '@middleware/validation';
import { createExperienceController, getExperiencesContoller, getExperienceContoller } from '@controllers/index';
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
    getExperiencesValidationSchema,
    getExperiencesContoller(context),
  );

  return router;
};
