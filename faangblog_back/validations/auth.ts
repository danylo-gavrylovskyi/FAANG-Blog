import { body } from 'express-validator';

export const registerValidation = [
  body('fullname').exists(),
  body('email', 'Incorrect e-mail format').isEmail(),
  body('password', 'Your password length must be at least 5 symbols').isLength({ min: 5 }),
  body('avatarUrl', 'Incorrect URL').optional().isURL(),
];
