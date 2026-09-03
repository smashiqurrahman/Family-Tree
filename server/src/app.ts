import express from "express";
import cors from "cors";
import helmet from "helmet";

import { prisma } from "./lib/prisma";
import errorMiddleware from "./middleware/error.middleware";
import AppError from "./utils/AppError";
import z from "zod";
import validate from "./middleware/validate.middleware";
import authRoutes from "./modules/auth/auth.routes";
import treeRoutes from "./modules/trees/tree.routes";
import personRoutes from "./modules/person/person.routes";

// library use start
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// library use end

// Routes start
app.use("/api/auth", authRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api", personRoutes);
// Routes end

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
    },
    message: "FamilyTree API is running",
  });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      data: {
        status: "ok",
        database: "connected",
      },
      message: "Database connection is healthy",
    });
  } catch (error) {
    console.error("❌ Database health check failed:");
    console.error(error);

    res.status(500).json({
      success: false,
      data: {
        status: "error",
        database: "disconnected",
      },
      message: "Database connection failed",
    });
  }
});

const testSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
  }),
  params: z.object({}),
  query: z.object({}),
});

app.post(
  "/api/test-validation",
  validate(testSchema),
  (req, res) => {
    res.json({
      success: true,
      data: req.body,
      message: "Validation successful",
    });
  }
);

// error handling middleware should be the last middleware
app.use(errorMiddleware);

export default app;
