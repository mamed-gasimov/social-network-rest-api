import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import { checkForAllowedFields, createExperienceValidationSchema } from '@middleware/validation';
import createExperienceController from '@controllers/experience/createExperience.controller';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';

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

  return router;
};
