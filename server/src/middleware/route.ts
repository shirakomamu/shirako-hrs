import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse } from "src/services/jwt";
import errorHandler from "./errorHandler";

export const route = (func: Function) => {
  return async (
    req: Request,
    res: Response | SrkExpressResponse,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    /* validate all generic errors */
    if (!errors.isEmpty()) {
      return errorHandler(
        new SrkError("badRequest", errors.mapped()),
        req,
        res,
        next
      );
    }

    try {
      await func(req, res, next);
    } catch (e) {
      return errorHandler(e, req, res, next);
    }
  };
};
