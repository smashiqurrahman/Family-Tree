import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not configured");
}

const jwtAccessExpiresIn =
  (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as NonNullable<
    SignOptions["expiresIn"]
  >;

const authConfig = {
  jwtAccessSecret,
  jwtAccessExpiresIn,
};

export default authConfig;