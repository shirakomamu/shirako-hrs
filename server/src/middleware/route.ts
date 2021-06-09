import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse } from "src/services/jwt";

export const route = (func: Function) => {
  return (
    req: Request,
    res: Response | SrkExpressResponse,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    /* validate all generic errors */
    if (!errors.isEmpty()) {
      throw new SrkError("badRequest", errors.mapped());
    }

    func(req, res, next);
  };
};
