import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';
import { upload } from '@libs/multer';

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        logger.error('File is too large');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'File is too large' });
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        logger.error('File count must be 1');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'File count must be 1' });
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        logger.error('Inalid image type');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid image type' });
      }
    }

    if (!err) next();
  });
};
