import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Невірний формат адреси').isEmail(),
  body('password', 'Пароль має містити мінімум 5 символів').isLength({
    min: 5,
  }),
  body('fullName', 'Імя має містити мінімум 3 символа').isLength({ min: 3 }),
  body('avatarUrl', 'Неправильна адреса для аватарки').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Невірний формат адреси').isEmail(),
    body('password', 'Пароль має містити мінімум 5 символів').isLength({
      min: 5,
    }),
]