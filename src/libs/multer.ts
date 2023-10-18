import multer, { MulterError } from 'multer';
import { v4 as uuid } from 'uuid';

import { FieldName } from '@middleware/uploadFile/uploadFile';

const oneMb = 1024 * 1024;
const sizeLimit = oneMb * 2;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/');
  },
  filename: (_req, file, cb) => {
    cb(null, `${uuid()}--${file.originalname}`);
  },
});

export const upload = (fieldName: FieldName) =>
  multer({
    storage,
    limits: {
      fileSize: sizeLimit,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        return cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
      }
    },
  }).single(fieldName);
