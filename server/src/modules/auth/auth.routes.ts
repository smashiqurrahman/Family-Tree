import { Router } from "express";

import validate from "../../middleware/validate.middleware";

import {
  login,
  me,
  register,
} from "./auth.controller";

import {
  loginSchema,
  registerSchema,
} from "./auth.schema";
import authenticate from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);


router.get(
  "/me",
  authenticate,
  me
);

export default router;