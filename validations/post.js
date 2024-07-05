import { body } from "express-validator";

export const postCreateValidation = [
    body('title', 'Введіть заголовок для статі').isLength({min:3}).isString(),
    body('text', 'Введіть текст для статі').isLength({min:10}).isString(),
    body('tags', 'Неправильний формат тегів').optional().isString(),
    body('imageUrl', 'Неправильне посилання на картинки').optional().isString(),
]