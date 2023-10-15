import { body } from 'express-validator';

export const loginValidationSchema = [
  body('email').trim().escape().notEmpty().withMessage('"email" is required').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('"password" is required')
    .isLength({ min: 8, max: 15 })
    .withMessage('Password length should be between 8 and 15 charactes'),
];
