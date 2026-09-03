import type { RequestHandler } from "express";
import { createPerson, getPersonById, getPersons, updatePerson } from "./person.service";
import { GetPersonInput, UpdatePersonInput, updatePersonSchema } from "./person.schema";

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

    const { params, body } = res.locals.validated;

    const person = await createPerson(req.user.userId, params.treeId, body);

    res.status(201).json({
      success: true,
      data: {
        person,
      },
      message: "Person created successfully",
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

    const { params } = res.locals.validated;

    const persons = await getPersons(req.user.userId, params.treeId);

    res.status(200).json({
      success: true,
      data: {
        persons,
      },
      message: "Persons retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
      return;
    }

    const { treeId, personId } =
      req.params as unknown as GetPersonInput["params"];

    const person = await getPersonById(req.user.userId, treeId, personId);

    res.status(200).json({
      success: true,
      data: {
        person,
      },
      message: "Person retrieved successfully",
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

    const person = await updatePerson(
      req.user.userId,
      params.treeId,
      params.personId,
      body,
    );

    res.status(200).json({
      success: true,
      data: {
        person,
      },
      message: "Person updated successfully",
    });
  } catch (error) {
    next(error);
  }
};