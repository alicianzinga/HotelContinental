const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// Configuração de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean); // Remove valores undefined/null

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      // Em produção, aceita qualquer origem do Render (para facilitar)
      if (origin.includes('.onrender.com')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));

// Rate limiting geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
    code: 'TOO_MANY_REQUESTS'
  }
});

app.use(generalLimiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rota raiz - informações da API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Agenda Hotel - Backend funcionando',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      usuarios: '/api/usuarios'
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de debug (apenas em desenvolvimento)
app.get('/debug', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Debug desabilitado em produção' });
  }
  
  res.json({
    success: true,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Rota de teste de conexão com Supabase
app.get('/test-db', async (req, res) => {
  try {
    const supabase = require('./config/database');
    
    // Testar conexão fazendo uma query simples
    const { data, error } = await supabase
      .from('usuario')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao conectar com o banco de dados',
        error: error.message,
        code: error.code,
        details: error
      });
    }
    
    // Tentar contar usuários
    const { count, error: countError } = await supabase
      .from('usuario')
      .select('*', { count: 'exact', head: true });
    
    res.json({
      success: true,
      message: 'Conexão com Supabase funcionando',
      tableExists: true,
      userCount: count || 0,
      supabaseUrl: process.env.SUPABASE_URL ? 'Configurado' : 'Não configurado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao testar conexão',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Rotas da API
app.use('/api/usuarios', usuarioRoutes);

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`👥 Usuários: http://localhost:${PORT}/api/usuarios`);
});

module.exports = app;

