import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import {
  checkForAllowedFields,
  createProjectValidationSchema,
  paramIdValidationSchema,
  queryForPaginationValidationSchema,
} from '@middleware/validation';
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
} from '@controllers/index';
import { allowedKeysForGetResourceWithPagination } from '@interfaces/paginationQuery';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { allowedKeysForCreateProject } from '@interfaces/projects/createProject';

export const makeProjectsRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin, UserRole.User]),
    uploadFile('projectImage'),
    checkForAllowedFields(allowedKeysForCreateProject),
    createProjectValidationSchema,
    createProjectController(context),
  );

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetResourceWithPagination, true),
    queryForPaginationValidationSchema,
    getProjectsController(context),
  );
  router.get('/:id', logRequestId, paramIdValidationSchema, getProjectController(context));

  router.put('/:id', logRequestId, [...paramIdValidationSchema]);

  router.delete('/:id', logRequestId, paramIdValidationSchema, deleteProjectController(context));

  return router;
};
