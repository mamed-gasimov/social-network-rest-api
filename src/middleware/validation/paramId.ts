import { param } from 'express-validator';

export const paramIdValidationSchema = [
  param('id').escape().notEmpty().withMessage('"id" is required').isInt({ gt: 0 }),
];

export const paramUserIdValidationSchema = [
  param('userId').escape().notEmpty().withMessage('"userId" is required').isInt({ gt: 0 }),
];
