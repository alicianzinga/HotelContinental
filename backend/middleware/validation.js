const Joi = require('joi');

// Schema para validação de criação de usuário
const createUserSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  
  pronome: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Pronome deve ter no máximo 20 caracteres'
    }),
  
  senha: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.max': 'Senha deve ter no máximo 100 caracteres'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido'
    }),
  
  tel: Joi.string()
    .pattern(/^[\d\s\(\)\-\+]+$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Telefone deve conter apenas números, espaços, parênteses, hífens e +'
    }),
  
  data_nascimento: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Data de nascimento não pode ser no futuro'
    }),
  
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'CPF deve conter exatamente 11 dígitos'
    })
});

// Schema para validação de atualização de usuário
const updateUserSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  
  pronome: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Pronome deve ter no máximo 20 caracteres'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email deve ter um formato válido'
    }),
  
  tel: Joi.string()
    .pattern(/^[\d\s\(\)\-\+]+$/)
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Telefone deve conter apenas números, espaços, parênteses, hífens e +'
    }),
  
  data_nascimento: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Data de nascimento não pode ser no futuro'
    }),
  
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'CPF deve conter exatamente 11 dígitos'
    }),
  
  active: Joi.boolean()
    .optional()
});

// Schema para validação de login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido'
    }),
  
  senha: Joi.string()
    .required()
    .messages({
      'string.empty': 'Senha é obrigatória'
    })
});

// Schema para validação de parâmetros de paginação
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
});

// Middleware de validação genérico
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: errorMessages
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  paginationSchema,
  validate
};

