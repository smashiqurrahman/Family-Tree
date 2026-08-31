import type { RequestHandler } from "express";
import type { ZodType } from "zod";

const validate = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data.body;
    req.params = result.data.params;

    next();
  };
};

export default validate;