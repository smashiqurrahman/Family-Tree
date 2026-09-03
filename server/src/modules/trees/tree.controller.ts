import type { RequestHandler } from "express";

import { createTree, deleteTree, getMyTrees, getTreeById, updateTree } from "./tree.service";
import AppError from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { GetTreeInput, UpdateTreeInput } from "./tree.schema";

export const create: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const existingTree = await prisma.tree.findFirst({
      where: {
        ownerId: req.user.userId,
        name: req.body.name,
      },
    });

    if (existingTree) {
      throw new AppError("You already have a tree with this name", 409);
    }

    const tree = await createTree(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      data: {
        tree,
      },
      message: "Tree created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const trees = await getMyTrees(req.user.userId);

    res.status(200).json({
      success: true,
      data: {
        trees,
      },
      message: "Trees retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getOne: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const treeId = Number(req.params.treeId);

    const tree = await getTreeById(
      req.user.userId,
      treeId,
    );

    res.status(200).json({
      success: true,
      data: {
        tree,
      },
      message: "Tree retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const { params, body } = res.locals.validated;

    const tree = await updateTree(
      req.user.userId,
      params.treeId,
      body,
    );

    res.status(200).json({
      success: true,
      data: {
        tree,
      },
      message: "Tree updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const remove: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const { params } = res.locals.validated;

    await deleteTree(
      req.user.userId,
      params.treeId,
    );

    res.status(200).json({
      success: true,
      data: null,
      message: "Tree deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};