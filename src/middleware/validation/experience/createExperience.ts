import { body } from 'express-validator';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

export const createExperienceValidationSchema = [
  body('userId').escape().notEmpty().withMessage('"userId" is required').isInt({ gt: 0 }),
  body('companyName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"companyName" is required')
    .isLength({ min: 1, max: 110 })
    .withMessage('"companyName" length can not be more than 110 characters long'),
  body('role')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"role" is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('"role" length can not be more than 255 characters long'),
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
  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"description" is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('"description" length should be between 10 and 1000 characters'),
];
