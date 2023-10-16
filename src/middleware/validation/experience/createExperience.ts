import { body } from 'express-validator';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

export const createExperienceValidationSchema = [
  body('userId').isInt({ gt: 0 }).escape().notEmpty().withMessage('"userId" is required'),
  body('companyName').trim().escape().notEmpty().withMessage('"companyName" is required'),
  body('role').trim().escape().notEmpty().withMessage('"role" is required'),
  body('startDate')
    .isDate({ format: 'MM-DD-YYYY' })
    .withMessage('"startDate" should be "MM-DD-YYYY" format')
    .escape()
    .notEmpty()
    .withMessage('"startDate" is required')
    .isBefore(tomorrow.toString()),
  body('endDate')
    .isDate({ format: 'MM-DD-YYYY' })
    .withMessage('"endDate" should be "MM-DD-YYYY" format')
    .escape()
    .notEmpty()
    .withMessage('"endDate" is required'),
  body('description').trim().escape().notEmpty().withMessage('"description" is required'),
];
