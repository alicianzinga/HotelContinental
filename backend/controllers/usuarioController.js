const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generateToken } = require('../middleware/auth');

class UsuarioController {
  // Criar novo usuário
  static async create(req, res, next) {
    try {
      console.log('📝 Tentativa de criar usuário:', { email: req.body.email, nome: req.body.nome });
      const { senha, ...userData } = req.body;

      // Verificar se email já existe
      const existingUser = await Usuario.findByEmail(userData.email);
      if (existingUser) {
        console.log('❌ Email já existe:', userData.email);
        return res.status(409).json({
          success: false,
          message: 'Email já cadastrado',
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }

      // Verificar se CPF já existe (se fornecido)
      if (userData.cpf) {
        const existingCpf = await Usuario.findByCpf(userData.cpf);
        if (existingCpf) {
          console.log('❌ CPF já existe:', userData.cpf);
          return res.status(409).json({
            success: false,
            message: 'CPF já cadastrado',
            code: 'CPF_ALREADY_EXISTS'
          });
        }
      }

      // Criptografar senha
      console.log('🔐 Criptografando senha...');
      const hashedPassword = await bcrypt.hash(senha, 12);

      // Criar usuário
      console.log('💾 Tentando criar usuário no banco...');
      const newUser = await Usuario.create({
        ...userData,
        senha: hashedPassword
      });
      console.log('✅ Usuário criado com sucesso:', newUser.id);

      // Gerar token
      const token = generateToken(newUser.id);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          usuario: newUser.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      next(error);
    }
  }

  // Login de usuário
  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      // Buscar usuário por email
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Gerar token
      const token = generateToken(usuario.id);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          usuario: usuario.toJSON(),
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Buscar usuário por ID
  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  // Listar usuários com paginação
  static async findAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await Usuario.findAll(page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Atualizar usuário
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Buscar usuário
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verificar se email já existe em outro usuário (se está sendo alterado)
      if (updateData.email && updateData.email !== usuario.email) {
        const existingUser = await Usuario.findByEmail(updateData.email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email já cadastrado por outro usuário',
            code: 'EMAIL_ALREADY_EXISTS'
          });
        }
      }

      // Verificar se CPF já existe em outro usuário (se está sendo alterado)
      if (updateData.cpf && updateData.cpf !== usuario.cpf) {
        const existingCpf = await Usuario.findByCpf(updateData.cpf);
        if (existingCpf) {
          return res.status(409).json({
            success: false,
            message: 'CPF já cadastrado por outro usuário',
            code: 'CPF_ALREADY_EXISTS'
          });
        }
      }

      // Atualizar usuário
      await usuario.update(updateData);

      res.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  // Deletar usuário (soft delete)
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBy = req.user ? req.user.id : null;

      // Buscar usuário
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      // Deletar usuário
      await usuario.delete(deletedBy);

      res.json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // Buscar perfil do usuário logado
  static async getProfile(req, res, next) {
    try {
      const usuario = req.user;

      res.json({
        success: true,
        data: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  // Atualizar perfil do usuário logado
  static async updateProfile(req, res, next) {
    try {
      const usuario = req.user;
      const updateData = req.body;

      // Verificar se email já existe em outro usuário (se está sendo alterado)
      if (updateData.email && updateData.email !== usuario.email) {
        const existingUser = await Usuario.findByEmail(updateData.email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email já cadastrado por outro usuário',
            code: 'EMAIL_ALREADY_EXISTS'
          });
        }
      }

      // Verificar se CPF já existe em outro usuário (se está sendo alterado)
      if (updateData.cpf && updateData.cpf !== usuario.cpf) {
        const existingCpf = await Usuario.findByCpf(updateData.cpf);
        if (existingCpf) {
          return res.status(409).json({
            success: false,
            message: 'CPF já cadastrado por outro usuário',
            code: 'CPF_ALREADY_EXISTS'
          });
        }
      }

      // Atualizar usuário
      await usuario.update(updateData);

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  // Alterar senha do usuário logado
  static async changePassword(req, res, next) {
    try {
      const { senhaAtual, novaSenha } = req.body;
      const usuario = req.user;

      // Verificar senha atual
      const isCurrentPasswordValid = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Senha atual incorreta',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Criptografar nova senha
      const hashedNewPassword = await bcrypt.hash(novaSenha, 12);

      // Atualizar senha
      await usuario.update({ senha: hashedNewPassword });

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsuarioController;

