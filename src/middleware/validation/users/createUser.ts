import { body } from 'express-validator';

export const createUserValidationSchema = [
  body('email').trim().escape().notEmpty().withMessage('"email" is required').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"password" is required')
    .isLength({ min: 8, max: 15 })
    .withMessage('Password length should be between 8 and 15 charactes'),
  body('firstName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"firstName" is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of firstName should be between 2 and 15 charactes'),
  body('lastName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"lastName" is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of lastName should be between 2 and 15 charactes'),
  body('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"title" is required')
    .isLength({ min: 2 })
    .withMessage('Length of title should be at least 2 characters'),
  body('summary')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"summary" is required')
    .isLength({ min: 2 })
    .withMessage('Length of summary should be at least 2 characters'),
  body('role')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"role" is required')
    .isIn(['Admin', 'User'])
    .withMessage('Role can only be "Admin" or "User"'),
];
