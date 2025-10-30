import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base do axios
const apiBaseURL = import.meta?.env?.VITE_API_BASE_URL || '/api';
const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Erro interno do servidor';
    
    // Tratamento específico para erros de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Sessão expirada. Faça login novamente.');
      return Promise.reject(error);
    }
    
    // Mostrar toast de erro para outros erros
    if (error.response?.status !== 422) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Serviços da API
export const authService = {
  // Login
  login: async (email, senha) => {
    try {
      const response = await api.post('/usuarios/login', {
        email,
        senha,
      });
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        toast.success('Login realizado com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/usuarios/register', userData);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        toast.success('Conta criada com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
  },

  // Obter perfil do usuário
  getProfile: async () => {
    try {
      const response = await api.get('/usuarios/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar perfil
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/usuarios/profile', userData);
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Perfil atualizado com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Alterar senha
  changePassword: async (senhaAtual, novaSenha) => {
    try {
      const response = await api.post('/usuarios/change-password', {
        senhaAtual,
        novaSenha,
      });
      
      if (response.success) {
        toast.success('Senha alterada com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
};

export const usuarioService = {
  // Listar usuários
  getUsuarios: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/usuarios', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obter usuário por ID
  getUsuario: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar usuário
  updateUsuario: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      
      if (response.success) {
        toast.success('Usuário atualizado com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Deletar usuário
  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      
      if (response.success) {
        toast.success('Usuário deletado com sucesso!');
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Função para obter o usuário atual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default api;

