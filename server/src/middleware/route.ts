import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const route = (func: Function) => {
  return async (
    req: Request,
    res: Response | AuthedResponse,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    /* validate all generic errors */
    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ServerResponse({
          error: ERROR_CODES.badRequest.name,
          payload: errors.mapped(),
        })
      );
    }

    /* process function and catch internal server errors */
    try {
      await func(req, res, next);
    } catch (e) {
      // if it's a managed error, then return it to user
      if (e instanceof HandledError) {
        console.error("Managed error:", e.name, e.message, e);
        return res.status(e.status).json(new ServerResponse({ error: e.name }));
      } else {
        // if it's an unknown error, throw a generic internal
        console.error("Unmanaged error:", e);
        return res
          .status(ERROR_CODES.internalError.status)
          .json(new ServerResponse({ error: ERROR_CODES.internalError.name }));
      }
    }
  };
};
