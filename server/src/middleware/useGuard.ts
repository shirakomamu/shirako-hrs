import { NextFunction, Request, Response } from "express";
import { SrkExpressRequest } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import { Guard } from "common/types/hrbac";
import hrbacCan from "common/utils/hrbacCan";

export default (guard: Guard) =>
  (req: Request | SrkExpressRequest, _res: Response, next: NextFunction) => {
    let result: boolean;
    if (!req.locals?.authResult) {
      result = hrbacCan(guard);
    } else {
      result = hrbacCan(guard, req.locals.authResult.actor);
    }

    if (!result) {
      return next(new SrkError("unauthorized"));
    }

    return next();
  };
