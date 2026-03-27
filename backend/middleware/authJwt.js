const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "auth_header_missing",
      message: "Нужен заголовок Authorization: Bearer <token>",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "token_invalid",
      message: "Токен недействителен или срок действия истёк",
    });
  }
}

// проверка роли
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole, JWT_SECRET };