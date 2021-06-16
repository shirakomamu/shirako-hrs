import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse } from "src/services/jwt";

export const route = (func: Function, cb?: Function) => {
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

      if (cb) {
        cb(req, res, next);
      }

      return;
    } catch (e) {
      return next(e);
    }
  };
};
