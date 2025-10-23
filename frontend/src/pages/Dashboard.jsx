import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Mail, Phone, Calendar, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Agenda Hotel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.nome}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Bem-vindo ao Dashboard!
            </h2>
            <p className="mt-2 text-gray-600">
              Gerencie seu perfil e explore as funcionalidades do sistema.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="card max-w-2xl">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.nome}
                </h3>
                {user?.pronome && (
                  <p className="text-sm text-gray-600">
                    Pronome: {user.pronome}
                  </p>
                )}
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>

              {/* Telefone */}
              {user?.tel && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-gray-900">{user.tel}</p>
                  </div>
                </div>
              )}

              {/* Data de Nascimento */}
              {user?.data_nascimento && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Data de Nascimento
                    </p>
                    <p className="text-gray-900">
                      {new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              {/* CPF */}
              {user?.cpf && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPF</p>
                    <p className="text-gray-900">
                      {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status da Conta</p>
                  <p className="text-gray-900">
                    {user?.active ? 'Ativa' : 'Inativa'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Membro desde</p>
                  <p className="text-gray-900">
                    {new Date(user?.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary">
                Editar Perfil
              </button>
              <button className="btn-secondary">
                Alterar Senha
              </button>
              <button className="btn-secondary">
                Configurações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

