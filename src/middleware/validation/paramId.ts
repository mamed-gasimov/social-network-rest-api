import { param } from 'express-validator';

export const paramIdValidationSchema = [
  param('id').escape().notEmpty().withMessage('"id" is required').isInt({ gt: 0 }),
];
