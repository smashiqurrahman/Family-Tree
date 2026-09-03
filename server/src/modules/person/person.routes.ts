import { Router } from "express";

import authenticate from "../../middleware/auth.middleware";
import validate from "../../middleware/validate.middleware";

import { createPersonSchema, getPersonSchema, getPersonsSchema, updatePersonSchema } from "./person.schema";
import { create, getAll, update } from "./person.controller";
import { getOne } from "../trees/tree.controller";

const router = Router();

router.post(
  "/trees/:treeId/persons",
  authenticate,
  validate(createPersonSchema),
  create,
);

router.get(
  "/trees/:treeId/persons",
  authenticate,
  validate(getPersonsSchema),
  getAll,
);

router.get(
  "/trees/:treeId/persons/:personId",
  authenticate,
  validate(getPersonSchema),
  getOne,
);

router.patch(
  "/trees/:treeId/persons/:personId",
  authenticate,
  validate(updatePersonSchema),
  update,
);

export default router;
