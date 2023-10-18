import { body } from 'express-validator';

export const createFeedbackValidationSchema = [
  body('fromUser').escape().notEmpty().withMessage('"fromUser" is required').isInt({ gt: 0 }),
  body('companyName').trim().escape().notEmpty().withMessage('"companyName" is required'),
  body('toUser').escape().notEmpty().withMessage('"toUser" is required').isInt({ gt: 0 }),
  body('context').trim().escape().notEmpty().withMessage('"context" is required'),
];
