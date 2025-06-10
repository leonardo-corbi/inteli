const UserModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthApiController {
  // Registrar novo usuário
  static async register(req, res) {
    try {
      const { nome, email, matricula, tipo, senha } = req.body;

      // Verificar se email já existe
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: "Email já está em uso",
        });
      }

      // Verificar se matrícula já existe
      const existingMatricula = await UserModel.findByMatricula(matricula);
      if (existingMatricula) {
        return res.status(409).json({
          success: false,
          error: "Matrícula já está em uso",
        });
      }

      // Criptografar senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Criar usuário
      const newUser = await UserModel.create({
        nome,
        email,
        matricula,
        tipo: tipo || "usuario", // Default para usuario
        senha: hashedPassword,
      });

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          tipo: newUser.tipo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remover senha da resposta
      const { senha: _, ...userResponse } = newUser;

      res.status(201).json({
        success: true,
        message: "Usuário registrado com sucesso",
        data: {
          user: userResponse,
          token,
          expiresIn: "24h",
        },
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscar usuário por email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos",
        });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(senha, user.senha);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha inválidos",
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          tipo: user.tipo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remover senha da resposta
      const { senha: _, ...userResponse } = user;

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          user: userResponse,
          token,
          expiresIn: "24h",
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      // O middleware já verificou o token e adicionou o usuário ao req
      const { senha: _, ...userResponse } = req.user;

      res.json({
        success: true,
        data: {
          user: userResponse,
          valid: true,
        },
      });
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      // Gerar novo token
      const token = jwt.sign(
        {
          userId: req.user.id,
          email: req.user.email,
          tipo: req.user.tipo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        message: "Token renovado com sucesso",
        data: {
          token,
          expiresIn: "24h",
        },
      });
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Alterar senha
  static async changePassword(req, res) {
    try {
      const { senha_atual, nova_senha } = req.body;

      // Buscar usuário atual
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(senha_atual, user.senha);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Senha atual incorreta",
        });
      }

      // Criptografar nova senha
      const hashedPassword = await bcrypt.hash(nova_senha, 10);

      // Atualizar senha
      await UserModel.update(req.user.id, { senha: hashedPassword });

      res.json({
        success: true,
        message: "Senha alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Esqueci minha senha (gerar token de reset)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Buscar usuário por email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Por segurança, não revelar se o email existe
        return res.json({
          success: true,
          message:
            "Se o email existir, você receberá instruções para redefinir sua senha",
        });
      }

      // Gerar token de reset (válido por 1 hora)
      const resetToken = jwt.sign(
        {
          userId: user.id,
          type: "password_reset",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Em um sistema real, você enviaria este token por email
      // Por enquanto, vamos apenas retornar o token
      res.json({
        success: true,
        message: "Token de reset gerado com sucesso",
        data: {
          resetToken,
          expiresIn: "1h",
          note: "Em produção, este token seria enviado por email",
        },
      });
    } catch (error) {
      console.error("Erro ao gerar token de reset:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Redefinir senha com token
  static async resetPassword(req, res) {
    try {
      const { token, nova_senha } = req.body;

      // Verificar token de reset
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Token de reset inválido ou expirado",
        });
      }

      // Verificar se é um token de reset
      if (decoded.type !== "password_reset") {
        return res.status(400).json({
          success: false,
          error: "Token inválido",
        });
      }

      // Buscar usuário
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      // Criptografar nova senha
      const hashedPassword = await bcrypt.hash(nova_senha, 10);

      // Atualizar senha
      await UserModel.update(user.id, { senha: hashedPassword });

      res.json({
        success: true,
        message: "Senha redefinida com sucesso",
      });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Logout (invalidar token - em um sistema real, você manteria uma blacklist)
  static async logout(req, res) {
    try {
      // Em um sistema real, você adicionaria o token a uma blacklist
      res.json({
        success: true,
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Obter perfil do usuário logado
  static async profile(req, res) {
    try {
      // Buscar dados atualizados do usuário
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      // Remover senha da resposta
      const { senha: _, ...userResponse } = user;

      res.json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Atualizar perfil do usuário logado
  static async updateProfile(req, res) {
    try {
      const { nome, email, matricula } = req.body;

      // Verificar se email já existe (exceto o próprio usuário)
      if (email) {
        const emailExists = await UserModel.emailExists(email, req.user.id);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
        }
      }

      // Verificar se matrícula já existe (exceto o próprio usuário)
      if (matricula) {
        const matriculaExists = await UserModel.matriculaExists(
          matricula,
          req.user.id
        );
        if (matriculaExists) {
          return res.status(409).json({
            success: false,
            error: "Matrícula já está em uso",
          });
        }
      }

      // Atualizar dados
      const updateData = {};
      if (nome) updateData.nome = nome;
      if (email) updateData.email = email;
      if (matricula) updateData.matricula = matricula;

      await UserModel.update(req.user.id, updateData);

      // Buscar dados atualizados
      const updatedUser = await UserModel.findById(req.user.id);
      const { senha: _, ...userResponse } = updatedUser;

      res.json({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: userResponse,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = AuthApiController;
