import { Router } from "express";

import authenticate from "../../middleware/auth.middleware";
import validate from "../../middleware/validate.middleware";

import {
  createTreeSchema,
  getTreeSchema,
  updateTreeSchema,
} from "./tree.schema";
import { create, getAll, getOne, remove, update } from "./tree.controller";

const router = Router();

router.post("/", authenticate, validate(createTreeSchema), create);

router.get("/", authenticate, getAll);

router.get("/:treeId", authenticate, validate(getTreeSchema), getOne);

router.patch("/:treeId", authenticate, validate(updateTreeSchema), update);

router.delete("/:treeId", authenticate, validate(getTreeSchema), remove);

export default router;
