import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Hotel, Mail, Lock, User, Phone, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('senha');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log('📝 Dados do formulário:', data);
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // O toast já é mostrado pelo interceptor do axios
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="card animate-fade-in">
          {/* Logo e título */}
          <div className="logo-container">
            <div className="flex items-center justify-center mb-4">
              <Hotel className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="logo-text">Agenda Hotel</h1>
            <p className="logo-subtitle">Crie sua conta</p>
          </div>

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" className="label-field">
                Nome completo *
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  className={`input-field pl-10 ${errors.nome ? 'input-error' : ''}`}
                  placeholder="Seu nome completo"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Nome deve ter no máximo 100 caracteres',
                    },
                  })}
                />
              </div>
              {errors.nome && (
                <p className="error-message">{errors.nome.message}</p>
              )}
            </div>

            {/* Campo Pronome */}
            <div>
              <label htmlFor="pronome" className="label-field">
                Pronome
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="pronome"
                  type="text"
                  className={`input-field pl-10 ${errors.pronome ? 'input-error' : ''}`}
                  placeholder="ele, ela, elu, etc."
                  {...register('pronome', {
                    maxLength: {
                      value: 20,
                      message: 'Pronome deve ter no máximo 20 caracteres',
                    },
                  })}
                />
              </div>
              {errors.pronome && (
                <p className="error-message">{errors.pronome.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="label-field">
                Email *
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="label-field">
                Senha *
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${errors.senha ? 'input-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="error-message">{errors.senha.message}</p>
              )}
            </div>

            {/* Campo Telefone */}
            <div>
              <label htmlFor="tel" className="label-field">
                Telefone
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="tel"
                  type="tel"
                  autoComplete="tel"
                  className={`input-field pl-10 ${errors.tel ? 'input-error' : ''}`}
                  placeholder="(11) 99999-9999"
                  {...register('tel', {
                    pattern: {
                      value: /^[\d\s\(\)\-\+]+$/,
                      message: 'Telefone deve conter apenas números, espaços, parênteses, hífens e +',
                    },
                  })}
                />
              </div>
              {errors.tel && (
                <p className="error-message">{errors.tel.message}</p>
              )}
            </div>

            {/* Campo Data de Nascimento */}
            <div>
              <label htmlFor="data_nascimento" className="label-field">
                Data de nascimento
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="data_nascimento"
                  type="date"
                  className={`input-field pl-10 ${errors.data_nascimento ? 'input-error' : ''}`}
                  {...register('data_nascimento', {
                    validate: (value) => {
                      if (!value) return true; // Campo opcional
                      const today = new Date();
                      const birthDate = new Date(value);
                      return birthDate <= today || 'Data de nascimento não pode ser no futuro';
                    },
                  })}
                />
              </div>
              {errors.data_nascimento && (
                <p className="error-message">{errors.data_nascimento.message}</p>
              )}
            </div>

            {/* Campo CPF */}
            <div>
              <label htmlFor="cpf" className="label-field">
                CPF
              </label>
              <div className="nestive-input-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="cpf"
                  type="text"
                  className={`input-field pl-10 ${errors.cpf ? 'input-error' : ''}`}
                  placeholder="00000000000"
                  {...register('cpf', {
                    pattern: {
                      value: /^\d{11}$/,
                      message: 'CPF deve conter exatamente 11 dígitos',
                    },
                  })}
                />
              </div>
              {errors.cpf && (
                <p className="error-message">{errors.cpf.message}</p>
              )}
            </div>

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>

            {/* Links */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sistema de gestão para hotéis e hospedagem
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

