import { body } from 'express-validator';

export const registerValidationSchema = [
  body('email').trim().escape().notEmpty().withMessage('"email" is required').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"password" is required')
    .isLength({ min: 8, max: 15 })
    .withMessage('"password" length should be between 8 and 15 characters'),
  body('firstName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"firstName" is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Length of "firstName" should be between 2 and 30 characters'),
  body('lastName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"lastName" is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Length of "lastName" should be between 2 and 30 characters'),
  body('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"title" is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Length of "title" should be between 2 and 255 characters'),
  body('summary')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"summary" is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Length of "summary" should be between 2 and 255 characters'),
];
