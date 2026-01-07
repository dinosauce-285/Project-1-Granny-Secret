import { ZodError } from "zod";

export const validate = (schemas) => (req, res, next) => {
  try {
    req.validated = {};

    // Validate Body
    if (schemas.body) {
      req.validated.body = schemas.body.parse(req.body);
    }

    // Validate Params
    if (schemas.params) {
      req.validated.params = schemas.params.parse(req.params);
    }

    // Validate Query
    if (schemas.query) {
      req.validated.query = schemas.query.parse(req.query);
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.error(
        "Invalid input",
        err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
        400
      );
    }

    return res.error(err.message || "Unknown Error", [], 500);
  }
};
