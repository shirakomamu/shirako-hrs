import { NextFunction, Request } from "express";
import { validationResult } from "express-validator";
import SrkError from "server/classes/SrkError";
import SrkResponse from "server/classes/SrkResponse";
import {
  declareResponse,
  SrkExpressRequest,
  SrkExpressResponse,
} from "server/services/jwt";

export const route = (func: Function, onFail?: Function) => {
  return async (
    req: Request | SrkExpressRequest,
    res: SrkExpressResponse,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    /* validate all generic errors */
    if (!errors.isEmpty()) {
      return next(new SrkError("badRequest", errors.mapped()));
    }

    try {
      const response: SrkResponse = await func(req, res);
      declareResponse(res, response);

      return next();
    } catch (e) {
      if (onFail) {
        await onFail(req, res);
      }
      return next(e);
    }
  };
};
