import { body } from 'express-validator';

export const createFeedbackValidationSchema = [
  body('fromUser').escape().notEmpty().withMessage('"fromUser" is required').isInt({ gt: 0 }),
  body('companyName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"companyName" is required')
    .isLength({ min: 1, max: 110 })
    .withMessage('"companyName" length can not be more than 110 characters long'),
  body('toUser').escape().notEmpty().withMessage('"toUser" is required').isInt({ gt: 0 }),
  body('context').trim().escape().notEmpty().withMessage('"context" is required'),
];
