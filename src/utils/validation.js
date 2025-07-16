const Joi = require('joi');

const schemas = [
  Joi.number().integer().min(1).max(100000).required().messages({
    'number.base': 'Пожалуйста, введите число (бюджет в долларах).',
    'number.min': 'Бюджет должен быть не меньше 1 доллара.',
    'number.max': 'Бюджет слишком большой.',
    'any.required': 'Пожалуйста, укажите бюджет.'
  }),
  Joi.number().integer().min(1).max(20).required().messages({
    'number.base': 'Введите количество взрослых (целое число).',
    'number.min': 'Должен быть хотя бы 1 взрослый.',
    'number.max': 'Слишком много взрослых.',
    'any.required': 'Пожалуйста, укажите количество взрослых.'
  }),
  Joi.number().integer().min(0).max(10).required().messages({
    'number.base': 'Введите количество детей (целое число).',
    'number.min': 'Не может быть меньше 0.',
    'number.max': 'Слишком много детей.',
    'any.required': 'Пожалуйста, укажите количество детей.'
  }),
  Joi.string().allow('').custom((value, helpers) => {
    if (!value.trim()) return value;
    const ages = value.split(',').map(a => a.trim());
    for (const age of ages) {
      const n = Number(age);
      if (!Number.isInteger(n) || n < 0 || n > 18) {
        return helpers.error('any.invalid');
      }
    }
    return value;
  }, 'Возраст детей').messages({
    'any.invalid': 'Возраст детей должен быть целым числом от 0 до 18, через запятую.'
  }),
  Joi.string().min(2).max(50).required().messages({
    'string.base': 'Введите страну или регион.',
    'string.empty': 'Пожалуйста, укажите страну или регион.',
    'string.min': 'Слишком короткое название.',
    'string.max': 'Слишком длинное название.'
  }),
  Joi.string().min(4).max(50).required().messages({
    'string.base': 'Введите даты вылета.',
    'string.empty': 'Пожалуйста, укажите даты вылета.',
    'string.min': 'Слишком коротко.',
    'string.max': 'Слишком длинно.'
  }),
  Joi.number().integer().min(1).max(60).required().messages({
    'number.base': 'Введите длительность тура в ночах (целое число).',
    'number.min': 'Минимум 1 ночь.',
    'number.max': 'Слишком длинный тур.'
  }),
  Joi.string().min(2).max(30).required().messages({
    'string.base': 'Введите категорию отеля.',
    'string.empty': 'Пожалуйста, укажите категорию отеля.',
    'string.min': 'Слишком коротко.',
    'string.max': 'Слишком длинно.'
  }),
  Joi.string().min(2).max(30).required().messages({
    'string.base': 'Введите тип питания.',
    'string.empty': 'Пожалуйста, укажите тип питания.',
    'string.min': 'Слишком коротко.',
    'string.max': 'Слишком длинно.'
  }),
  Joi.string().allow('').max(200).messages({
    'string.max': 'Слишком длинные пожелания.'
  }),
  Joi.string().min(2).max(50).required().messages({
    'string.base': 'Введите ваше имя.',
    'string.empty': 'Пожалуйста, укажите имя.',
    'string.min': 'Слишком короткое имя.',
    'string.max': 'Слишком длинное имя.'
  }),
  Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
    'string.pattern.base': 'Введите телефон в формате +79991234567 или 89991234567.',
    'string.empty': 'Пожалуйста, укажите телефон.'
  }),
  Joi.string().email({ tlds: { allow: false } }).allow('').messages({
    'string.email': 'Введите корректный email или оставьте поле пустым.'
  })
];

module.exports = { schemas }; 