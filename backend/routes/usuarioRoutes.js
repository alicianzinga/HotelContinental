const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const UsuarioController = require('../controllers/usuarioController');
const { authenticateToken, canAccessResource } = require('../middleware/auth');
const { 
  validate, 
  createUserSchema, 
  updateUserSchema, 
  loginSchema, 
  paginationSchema 
} = require('../middleware/validation');

// Rate limiting para login e registro
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'TOO_MANY_ATTEMPTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP por hora
  message: {
    success: false,
    message: 'Muitas tentativas de registro. Tente novamente em 1 hora.',
    code: 'TOO_MANY_REGISTERS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rotas públicas
router.post('/register', 
  registerLimiter,
  validate(createUserSchema),
  UsuarioController.create
);

router.post('/login', 
  authLimiter,
  validate(loginSchema),
  UsuarioController.login
);

// Rotas protegidas - requerem autenticação
router.get('/profile', 
  authenticateToken,
  UsuarioController.getProfile
);

router.put('/profile', 
  authenticateToken,
  validate(updateUserSchema),
  UsuarioController.updateProfile
);

router.post('/change-password', 
  authenticateToken,
  UsuarioController.changePassword
);

// Rotas CRUD para usuários
router.get('/', 
  authenticateToken,
  validate(paginationSchema, 'query'),
  UsuarioController.findAll
);

router.get('/:id', 
  authenticateToken,
  canAccessResource,
  UsuarioController.findById
);

router.put('/:id', 
  authenticateToken,
  canAccessResource,
  validate(updateUserSchema),
  UsuarioController.update
);

router.delete('/:id', 
  authenticateToken,
  canAccessResource,
  UsuarioController.delete
);

module.exports = router;

