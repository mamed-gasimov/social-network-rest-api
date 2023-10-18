import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import { paramIdValidationSchema, queryForPaginationValidationSchema } from '@middleware/validation';

export const makeProjectsRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post('/', logRequestId, roles([UserRole.Admin, UserRole.User]));

  router.get('/', logRequestId, roles([UserRole.Admin]), queryForPaginationValidationSchema);
  router.get('/:id', logRequestId, paramIdValidationSchema);

  router.put('/:id', logRequestId, [...paramIdValidationSchema]);

  router.delete('/:id', logRequestId, paramIdValidationSchema);

  return router;
};
