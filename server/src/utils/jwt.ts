import jwt, { type SignOptions } from "jsonwebtoken";

import authConfig from "../config/auth.config";

export interface AccessTokenPayload {
  userId: number;
}

export const generateAccessToken = (
  payload: AccessTokenPayload
): string => {
  const options: SignOptions = {
    expiresIn: authConfig.jwtAccessExpiresIn,
  };

  return jwt.sign(
    payload,
    authConfig.jwtAccessSecret,
    options
  );
};