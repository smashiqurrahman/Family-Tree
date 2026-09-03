import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { CreatePersonInput, UpdatePersonInput } from "./person.schema";

export const createPerson = async (
  userId: number,
  treeId: number,
  input: CreatePersonInput["body"],
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
      "You do not have permission to add a person to this tree",
      403,
    );
  }

  const person = await prisma.person.create({
    data: {
      treeId,
      name: input.name.trim(),
      gender: input.gender ?? "UNKNOWN",
      ...(input.birthDate !== undefined && {
        birthDate: new Date(input.birthDate),
      }),
      ...(input.deathDate !== undefined && {
        deathDate: new Date(input.deathDate),
      }),
      ...(input.photo !== undefined && {
        photo: input.photo,
      }),
      ...(input.bio !== undefined && {
        bio: input.bio.trim(),
      }),
    },
  });

  return person;
};



export const getPersons = async (
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

  const persons = await prisma.person.findMany({
    where: {
      treeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return persons;
};



export const getPersonById = async (
  userId: number,
  treeId: number,
  personId: number,
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

  const person = await prisma.person.findFirst({
    where: {
      id: personId,
      treeId,
    },
  });

  if (!person) {
    throw new AppError("Person not found", 404);
  }

  return person;
};


export const updatePerson = async (
  userId: number,
  treeId: number,
  personId: number,
  input: UpdatePersonInput["body"],
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

  const existingPerson = await prisma.person.findFirst({
    where: {
      id: personId,
      treeId,
    },
  });

  if (!existingPerson) {
    throw new AppError("Person not found", 404);
  }

  const birthDate =
    input.birthDate !== undefined
      ? new Date(input.birthDate)
      : existingPerson.birthDate;

  const deathDate =
    input.deathDate !== undefined
      ? new Date(input.deathDate)
      : existingPerson.deathDate;

  if (
    birthDate &&
    deathDate &&
    birthDate > deathDate
  ) {
    throw new AppError(
      "Birth date cannot be after death date",
      400,
    );
  }

  const data: Prisma.PersonUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name.trim();
  }

  if (input.gender !== undefined) {
    data.gender = input.gender;
  }

  if (input.birthDate !== undefined) {
    data.birthDate = new Date(input.birthDate);
  }

  if (input.deathDate !== undefined) {
    data.deathDate = new Date(input.deathDate);
  }

  if (input.photo !== undefined) {
    data.photo = input.photo;
  }

  if (input.bio !== undefined) {
    data.bio = input.bio.trim();
  }

  const updatedPerson = await prisma.person.update({
    where: {
      id: personId,
    },
    data,
  });

  return updatedPerson;
};
