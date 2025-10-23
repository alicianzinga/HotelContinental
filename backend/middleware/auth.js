const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const usuario = await Usuario.findById(decoded.userId);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional de autenticação (não bloqueia se não houver token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.userId);
      
      if (usuario) {
        req.user = usuario;
      }
    }
    
    next();
  } catch (error) {
    // Se houver erro, continua sem usuário autenticado
    next();
  }
};

// Middleware para verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  // Aqui você pode adicionar lógica para verificar se é admin
  // Por enquanto, vamos assumir que todos os usuários autenticados podem acessar
  next();
};

// Função para gerar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Função para verificar se o usuário pode acessar um recurso
const canAccessResource = (req, res, next) => {
  const resourceUserId = req.params.id;
  const currentUserId = req.user.id;

  // Usuário pode acessar seus próprios dados
  if (resourceUserId === currentUserId) {
    return next();
  }

  // Aqui você pode adicionar lógica adicional para verificar permissões
  // Por exemplo, verificar se é admin, etc.
  
  return res.status(403).json({
    success: false,
    message: 'Acesso negado a este recurso'
  });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  generateToken,
  canAccessResource
};

