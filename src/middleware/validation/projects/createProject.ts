import { body } from 'express-validator';

export const createProjectValidationSchema = [
  body('userId').escape().notEmpty().withMessage('"userId" is required').isInt({ gt: 0 }),
  body('image').trim().escape().notEmpty().withMessage('"image" is required'),
  body('description').trim().escape().notEmpty().withMessage('"description" is required'),
];
