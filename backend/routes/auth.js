const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { authMiddleware, JWT_SECRET } = require("../middleware/authJwt");

const router = express.Router();

// Хранилище пользователей (в памяти)
const users = [];

// Автоматическое создание администратора при запуске
setTimeout(() => {
  const adminExists = users.find(u => u.role === "admin");
  if (!adminExists && users.length === 0) {
    bcrypt.hash("admin123", 10).then(passwordHash => {
      users.push({
        id: nanoid(8),
        email: "admin@shop.com",
        first_name: "Polina",
        last_name: "Zavershinskaya",
        passwordHash,
        role: "admin",
        createdAt: new Date().toISOString()
      });
      console.log("Администратор создан: admin@shop.com / admin123");
    });
  }
}, 1000);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Регистрация, вход и профиль пользователя
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Ошибка валидации
 */
router.post("/register", async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({
      error: "validation_error",
      message: "Все поля обязательны"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Некорректный формат email" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль минимум 6 символов" });
  }

  const normalizedEmail = email.toLowerCase();
  const exists = users.find(u => u.email === normalizedEmail);
  if (exists) {
    return res.status(400).json({ error: "Пользователь уже существует" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: nanoid(8),
    email: normalizedEmail,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    passwordHash,
    role: "user",
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.status(201).json({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const normalizedEmail = email.toLowerCase();
  const user = users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // В токен добавляем role
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, type: "refresh" },
    JWT_SECRET + "_refresh",
    { expiresIn: "7d" }
  );

  res.json({ accessToken, refreshToken });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, (req, res) => {
  const userId = req.user.sub;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  res.json({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить access token
 *     tags: [Auth]
 */
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET + "_refresh");
    
    // Ищем пользователя, чтобы получить роль
    const user = users.find(u => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const newAccessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: "Недействительный refresh token" });
  }
});

module.exports = router;