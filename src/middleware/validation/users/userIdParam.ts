import { param } from 'express-validator';

export const userIdValidationSchema = [
  param('id').isInt({ gt: 0 }).escape().notEmpty().withMessage('"id" is required'),
];
