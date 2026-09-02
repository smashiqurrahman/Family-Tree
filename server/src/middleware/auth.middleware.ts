import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import authConfig from "../config/auth.config";
import AppError from "../utils/AppError";

interface AccessTokenPayload {
  userId: number;
}

const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Authentication required", 401);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header", 401);
    }

    const decoded = jwt.verify(
      token,
      authConfig.jwtAccessSecret
    ) as AccessTokenPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("Invalid or expired access token", 401));
  }
};

export default authenticate;