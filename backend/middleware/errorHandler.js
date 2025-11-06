// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erro de validação do banco de dados
  if (err.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: 'Dados duplicados. Email ou CPF já cadastrado.',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (err.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      message: 'Referência inválida. Registro relacionado não encontrado.',
      code: 'FOREIGN_KEY_VIOLATION'
    });
  }

  if (err.code === '23502') { // Not null constraint violation
    return res.status(400).json({
      success: false,
      message: 'Campo obrigatório não fornecido.',
      code: 'NOT_NULL_VIOLATION'
    });
  }

  // Erro de conexão com banco de dados
  if (err.message && err.message.includes('Supabase')) {
    return res.status(503).json({
      success: false,
      message: 'Serviço de banco de dados indisponível. Tente novamente mais tarde.',
      code: 'DATABASE_ERROR'
    });
  }

  // Erro de senha incorreta
  if (err.message && err.message.includes('senha')) {
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos.',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Erro de usuário não encontrado
  if (err.message && err.message.includes('não encontrado')) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado.',
      code: 'USER_NOT_FOUND'
    });
  }

  // Erro padrão do servidor
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err.details,
      hint: err.hint
    })
  });
};

// Middleware para capturar rotas não encontradas
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.originalUrl} não encontrada`,
    code: 'ROUTE_NOT_FOUND'
  });
};

module.exports = {
  errorHandler,
  notFound
};

