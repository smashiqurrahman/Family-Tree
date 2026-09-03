import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

import type { CreateTreeInput, UpdateTreeInput } from "./tree.schema";

export const createTree = async (
  userId: number,
  input: CreateTreeInput["body"],
) => {
  const name = input.name.trim();

  if (!name) {
    throw new AppError("Tree name is required", 400);
  }

  const tree = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdTree = await tx.tree.create({
        data: {
          ownerId: userId,
          name,

          ...(input.description !== undefined && {
            description: input.description.trim(),
          }),

          ...(input.coverImage !== undefined && {
            coverImage: input.coverImage,
          }),
        },
      });

      await tx.treeMember.create({
        data: {
          treeId: createdTree.id,
          userId,
          role: "OWNER",
        },
      });

      return createdTree;
    },
  );

  return tree;
};

export const getMyTrees = async (userId: number) => {
  const trees = await prisma.tree.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return trees;
};



export const getTreeById = async (
  userId: number,
  treeId: number,
) => {
  const tree = await prisma.tree.findUnique({
    where: {
      id: treeId,
    },
  });

  if (!tree) {
    throw new AppError("Tree not found", 404);
  }

  if (tree.ownerId !== userId) {
    throw new AppError(
      "You do not have access to this tree",
      403,
    );
  }

  return tree;
};



export const updateTree = async (
  userId: number,
  treeId: number,
  input: UpdateTreeInput["body"],
) => {
  const existingTree = await prisma.tree.findUnique({
    where: {
      id: treeId,
    },
  });

  if (!existingTree) {
    throw new AppError("Tree not found", 404);
  }

  if (existingTree.ownerId !== userId) {
    throw new AppError(
      "You do not have permission to update this tree",
      403,
    );
  }

  if (input.name !== undefined) {
    const duplicateTree = await prisma.tree.findFirst({
      where: {
        ownerId: userId,
        name: input.name.trim(),
        NOT: {
          id: treeId,
        },
      },
    });

    if (duplicateTree) {
      throw new AppError(
        "You already have a tree with this name",
        409,
      );
    }
  }

  const data: Prisma.TreeUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name.trim();
  }

  if (input.description !== undefined) {
    data.description = input.description.trim();
  }

  if (input.coverImage !== undefined) {
    data.coverImage = input.coverImage;
  }

  const updatedTree = await prisma.tree.update({
    where: {
      id: treeId,
    },
    data,
  });

  return updatedTree;
};


export const deleteTree = async (
  userId: number,
  treeId: number,
) => {
  const existingTree = await prisma.tree.findUnique({
    where: {
      id: treeId,
    },
  });

  if (!existingTree) {
    throw new AppError("Tree not found", 404);
  }

  if (existingTree.ownerId !== userId) {
    throw new AppError(
      "You do not have permission to delete this tree",
      403,
    );
  }

  await prisma.tree.delete({
    where: {
      id: treeId,
    },
  });
};