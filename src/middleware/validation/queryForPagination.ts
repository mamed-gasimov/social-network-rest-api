import { query } from 'express-validator';

export const queryForPaginationValidationSchema = [
  query('pageSize')
    .escape()
    .notEmpty()
    .withMessage('"pageSize" is required')
    .isInt({ gt: 0 })
    .withMessage('Invalid "pageSize" value'),
  query('page')
    .escape()
    .notEmpty()
    .withMessage('"page" is required')
    .isInt({ gt: 0 })
    .withMessage('Invalid "page" value'),
];
