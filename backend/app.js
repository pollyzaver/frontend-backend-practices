const express = require("express");
const cors = require("cors");

// Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("./middleware/logger");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.json());
app.use(logger);

// Swagger настройка
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vinyl Store API",
      version: "1.0.0",
      description: "REST API для магазина виниловых пластинок",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck
app.get("/", (req, res) => {
  res.send("Vinyl Store API. Документация: /api-docs");
});

// Роуты
app.use("/api/products", productsRouter);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});