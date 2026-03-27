const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authJwt");

// Будет заполнено из auth.js
let users = [];

// Экспортируем функцию для установки users
router.setUsers = (userStore) => {
  users = userStore;
};

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Административные функции
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Получить всех пользователей (только админ)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 */
router.get("/users", authMiddleware, requireRole(["admin"]), (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    first_name: u.first_name,
    last_name: u.last_name,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Сменить роль пользователя (только админ)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Роль обновлена
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
router.patch("/users/:id/role", authMiddleware, requireRole(["admin"]), (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Недопустимая роль" });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  user.role = role;
  res.json({ id: user.id, email: user.email, role: user.role });
});

module.exports = router;