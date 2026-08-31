import type { ErrorRequestHandler } from "express";

import AppError from "../utils/AppError";

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      message: error.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    data: null,
    message: "Internal server error",
  });
};

export default errorMiddleware;