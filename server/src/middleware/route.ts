import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse } from "src/services/jwt";

export const route = (func: Function, onError?: Function) => {
  return async (
    req: Request,
    res: Response | SrkExpressResponse,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    /* validate all generic errors */
    if (!errors.isEmpty()) {
      return next(new SrkError("badRequest", errors.mapped()));
    }

    try {
      await func(req, res, next);

      return next();
    } catch (e) {
      if (onError) {
        await onError(req, res, next);
      } else {
        return next(e);
      }
    }
  };
};
