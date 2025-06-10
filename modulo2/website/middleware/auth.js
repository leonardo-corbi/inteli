const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// Middleware de autenticação JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    console.log(token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso requerido",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        error: "Token inválido",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        error: "Token expirado",
      });
    }

    console.error("Erro na autenticação:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.tipo !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Acesso negado. Apenas administradores.",
    });
  }
  next();
};

// Middleware para verificar se é o próprio usuário ou admin
const requireOwnerOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);

  if (req.user.tipo !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: "Acesso negado. Você só pode acessar seus próprios dados.",
    });
  }
  next();
};

// Middleware de validação de dados
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (!req.body[field] || req.body[field].toString().trim() === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

// Middleware de validação de email
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
      });
    }
  }

  next();
};

// Middleware de validação de senha
const validatePassword = (req, res, next) => {
  const { senha } = req.body;

  if (senha) {
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Senha deve ter pelo menos 6 caracteres",
      });
    }
  }

  next();
};

// Middleware de validação de data
const validateDate = (req, res, next) => {
  const { data_inicio, data_fim } = req.body;

  if (data_inicio && data_fim) {
    const startDate = new Date(data_inicio);
    const endDate = new Date(data_fim);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Datas inválidas",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        error: "Data de fim deve ser posterior à data de início",
      });
    }

    // Verificar se data de início não é no passado (apenas para novas reservas)
    if (req.method === "POST" && startDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Data de início não pode ser no passado",
      });
    }
  }

  next();
};

// Middleware de paginação
const pagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Limitar o número máximo de itens por página
  if (limit > 100) {
    return res.status(400).json({
      success: false,
      error: "Limite máximo de 100 itens por página",
    });
  }

  req.pagination = {
    page,
    limit,
    offset,
  };

  next();
};

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error("Erro na API:", err);

  // Erro de validação do banco
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({
      success: false,
      error: "Dados já existem no sistema",
    });
  }

  // Erro de referência (foreign key)
  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      error: "Referência inválida",
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  });
};

// Middleware de CORS personalizado
const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin,
  validateRequired,
  validateEmail,
  validatePassword,
  validateDate,
  pagination,
  errorHandler,
  corsMiddleware,
};
