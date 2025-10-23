const supabase = require('../config/database');

class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.pronome = data.pronome;
    this.senha = data.senha;
    this.email = data.email;
    this.tel = data.tel;
    this.data_nascimento = data.data_nascimento;
    this.cpf = data.cpf;
    this.created_at = data.created_at;
    this.active = data.active;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return new Usuario(data);
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      return data ? new Usuario(data) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? new Usuario(data) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  // Buscar usuário por CPF
  static async findByCpf(cpf) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('cpf', cpf)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? new Usuario(data) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por CPF: ${error.message}`);
    }
  }

  // Listar todos os usuários
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('usuario')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        usuarios: data.map(user => new Usuario(user)),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }

  // Atualizar usuário
  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .update(updateData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar dados da instância
      Object.assign(this, data);
      return this;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deletar usuário (soft delete)
  async delete(deletedBy = null) {
    try {
      const deleteData = {
        active: false,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy
      };

      const { data, error } = await supabase
        .from('usuario')
        .update(deleteData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar dados da instância
      Object.assign(this, data);
      return this;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  // Deletar usuário permanentemente
  async deletePermanently() {
    try {
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('id', this.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário permanentemente: ${error.message}`);
    }
  }

  // Converter para objeto JSON (sem senha)
  toJSON() {
    const userObj = { ...this };
    delete userObj.senha;
    return userObj;
  }
}

module.exports = Usuario;

