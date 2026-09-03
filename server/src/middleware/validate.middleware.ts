// import type { RequestHandler } from "express";
// import type { ZodType } from "zod";

// type ValidationData = {
//   body: unknown;
//   params: unknown;
//   query: unknown;
// };

// const validate = (
//   schema: ZodType<ValidationData>
// ): RequestHandler => {
//   return (req, _res, next) => {
//     const result = schema.safeParse({
//       body: req.body,
//       params: req.params,
//       query: req.query,
//     });

//     if (!result.success) {
//       next(result.error);
//       return;
//     }

//     req.body = result.data.body;

//     next();
//   };
// };

// export default validate;

import type { RequestHandler } from "express";
import type { ZodType } from "zod";

const validate = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.validated = result.data;

    next();
  };
};

export default validate;