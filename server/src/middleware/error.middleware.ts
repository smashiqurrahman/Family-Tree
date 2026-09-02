import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import AppError from "../utils/AppError";

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error(error);

  // Zod validation error
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: {
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      message: "Validation failed",
    });

    return;
  }

  // Operational application error
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      message: error.message,
    });

    return;
  }

  // Unknown / unexpected error
  res.status(500).json({
    success: false,
    data: null,
    message: "Internal server error",
  });
};

export default errorMiddleware;