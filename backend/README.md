# Backend - API de Agenda Hotel

API REST para sistema de agenda hotel com funcionalidades CRUD para usuários e autenticação JWT.

## 🚀 Funcionalidades

- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ CRUD completo de usuários
- ✅ Validação de dados
- ✅ Rate limiting
- ✅ Middleware de autenticação
- ✅ Tratamento de erros
- ✅ Soft delete
- ✅ Paginação
- ✅ Criptografia de senhas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Conta no Supabase
- Banco de dados PostgreSQL configurado

## 🛠️ Instalação

1. **Clone o repositório e navegue para o diretório backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# Configurações do servidor
PORT=3000
NODE_ENV=development
```

4. **Execute o banco de dados:**
Execute o SQL fornecido no arquivo de schema no editor SQL do Supabase.

## 🚀 Executando a aplicação

**Modo desenvolvimento:**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### Endpoints disponíveis:

#### Autenticação
- `POST /api/usuarios/register` - Cadastrar novo usuário
- `POST /api/usuarios/login` - Fazer login

#### Perfil do usuário
- `GET /api/usuarios/profile` - Obter perfil do usuário logado
- `PUT /api/usuarios/profile` - Atualizar perfil do usuário logado
- `POST /api/usuarios/change-password` - Alterar senha

#### CRUD de usuários
- `GET /api/usuarios` - Listar usuários (com paginação)
- `GET /api/usuarios/:id` - Obter usuário por ID
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário (soft delete)

#### Utilitários
- `GET /health` - Health check da API

### Exemplos de uso:

#### Cadastro de usuário:
```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "pronome": "ele",
    "email": "joao@email.com",
    "senha": "123456",
    "tel": "(11) 99999-9999",
    "data_nascimento": "1990-01-01",
    "cpf": "12345678901"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

#### Obter perfil (com token):
```bash
curl -X GET http://localhost:3000/api/usuarios/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔐 Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT para autenticação
- Rate limiting para prevenir ataques
- Validação de dados de entrada
- CORS configurado
- Helmet para headers de segurança

## 🧪 Testes

```bash
npm test
```

## 📝 Estrutura do projeto

```
backend/
├── config/
│   └── database.js          # Configuração do Supabase
├── controllers/
│   └── usuarioController.js # Controladores da API
├── middleware/
│   ├── auth.js             # Middleware de autenticação
│   ├── errorHandler.js     # Tratamento de erros
│   └── validation.js       # Validação de dados
├── models/
│   └── Usuario.js          # Modelo de usuário
├── routes/
│   └── usuarioRoutes.js    # Rotas da API
├── server.js               # Servidor principal
├── package.json            # Dependências
└── README.md              # Documentação
```

## 🐛 Troubleshooting

### Erro de conexão com banco:
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o banco está rodando
- Verifique as credenciais do Supabase

### Erro de autenticação:
- Verifique se o JWT_SECRET está configurado
- Confirme se o token está sendo enviado corretamente

### Rate limiting:
- Ajuste os limites no arquivo de configuração se necessário
- Use diferentes IPs para testes se estiver atingindo o limite

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do servidor
2. Documentação do Supabase
3. Issues do projeto

