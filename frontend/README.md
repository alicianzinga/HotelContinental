# Frontend - Agenda Hotel

Interface React para o sistema de agenda hotel com páginas de login, cadastro e dashboard.

## 🚀 Funcionalidades

- ✅ Página de login com validação
- ✅ Página de cadastro com validação
- ✅ Dashboard do usuário
- ✅ Autenticação JWT
- ✅ Roteamento protegido
- ✅ Design responsivo
- ✅ Validação de formulários
- ✅ Notificações toast
- ✅ Contexto de autenticação

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Backend rodando na porta 3000

## 🛠️ Instalação

1. **Navegue para o diretório frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001`

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📱 Páginas Disponíveis

### **Login (`/login`)**
- Formulário de login com email e senha
- Validação de campos obrigatórios
- Integração com API de autenticação
- Redirecionamento automático após login

### **Cadastro (`/register`)**
- Formulário completo de cadastro
- Campos: nome, pronome, email, senha, telefone, data de nascimento, CPF
- Validação de todos os campos
- Integração com API de registro

### **Dashboard (`/dashboard`)**
- Página principal após login
- Exibição dos dados do usuário
- Ações rápidas
- Botão de logout

## 🔐 Autenticação

O sistema utiliza JWT para autenticação:

- **Token** armazenado no localStorage
- **Dados do usuário** armazenados no contexto React
- **Rotas protegidas** com middleware de autenticação
- **Redirecionamento automático** para login se não autenticado

## 🎨 Design

- **Design responsivo** para desktop e mobile
- **Tema moderno** com cores primárias e secundárias
- **Animações suaves** para melhor UX
- **Componentes reutilizáveis** com Tailwind CSS

## 📝 Estrutura do Projeto

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Componente de rota protegida
│   ├── contexts/
│   │   └── AuthContext.jsx       # Contexto de autenticação
│   ├── pages/
│   │   ├── Login.jsx             # Página de login
│   │   ├── Register.jsx          # Página de cadastro
│   │   └── Dashboard.jsx         # Dashboard do usuário
│   ├── services/
│   │   └── api.js                # Serviços da API
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
├── index.html                    # HTML principal
├── package.json                  # Dependências
├── tailwind.config.js           # Configuração do Tailwind
├── vite.config.js               # Configuração do Vite
└── README.md                    # Documentação
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 🌐 Configuração da API

O frontend está configurado para se comunicar com o backend através de proxy:

- **Desenvolvimento**: Proxy para `http://localhost:3000`
- **Produção**: Configurar URL da API nas variáveis de ambiente

## 📱 Responsividade

O design é totalmente responsivo:

- **Mobile**: Layout otimizado para telas pequenas
- **Tablet**: Layout adaptado para telas médias
- **Desktop**: Layout completo para telas grandes

## 🎯 Próximos Passos

- [ ] Página de edição de perfil
- [ ] Alteração de senha
- [ ] Gestão de usuários (admin)
- [ ] Sistema de reservas
- [ ] Relatórios
- [ ] Configurações do sistema

## 🐛 Troubleshooting

### Erro de conexão com API:
- Verifique se o backend está rodando na porta 3000
- Confirme se o proxy está configurado corretamente

### Erro de autenticação:
- Verifique se o token está sendo salvo no localStorage
- Confirme se as rotas protegidas estão funcionando

### Problemas de estilo:
- Verifique se o Tailwind CSS está configurado corretamente
- Confirme se as classes CSS estão sendo aplicadas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme se todas as dependências estão instaladas
3. Verifique se o backend está funcionando corretamente

