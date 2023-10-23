import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

import { HTTP_STATUSES } from '@interfaces/general';
import { upload } from '@libs/multer';
import { CustomError } from '@helpers/customError';

export type FieldName = 'avatar' | 'projectImage';

export const uploadFile = (fieldName: FieldName) => (req: Request, res: Response, next: NextFunction) => {
  upload(fieldName)(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'File is too large');
        return next(error);
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'File count must be 1');
        return next(error);
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'Invalid image type');
        return next(error);
      }
    }

    if (!err) next();
  });
};
