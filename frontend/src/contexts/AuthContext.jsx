import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, getCurrentUser, isAuthenticated } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setIsAuth(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await authService.login(email, senha);
      console.log('📦 Resposta no AuthContext:', response);
      // response já é o data retornado pelo authService (que contém usuario e token)
      if (response && response.usuario) {
        setUser(response.usuario);
        setIsAuth(true);
        return response;
      } else {
        throw new Error('Resposta inválida: usuário não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro no AuthContext.login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      console.log('📦 Resposta no AuthContext:', response);
      // response já é o data retornado pelo authService (que contém usuario e token)
      if (response && response.usuario) {
        setUser(response.usuario);
        setIsAuth(true);
        return response;
      } else {
        throw new Error('Resposta inválida: usuário não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro no AuthContext.register:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuth(false);
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Função para obter perfil atualizado
  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuth,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

