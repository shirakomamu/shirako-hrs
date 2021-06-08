import { NextFunction, Request, Response } from "express";
import hrbac from "src/services/hrbac";
import { types as GuardTypes } from "src/services/guard";
import { interfaces as JwtInterfaces } from "src/services/jwt";
import SrkError from "src/classes/SrkError";

function assert(
  _res: unknown
): asserts _res is JwtInterfaces.SrkExpressResponse {}

export default (guard: GuardTypes.Guard) =>
  (
    _req: Request,
    res: Response | JwtInterfaces.SrkExpressResponse,
    next: NextFunction
  ) => {
    let result: boolean;
    if (!res.locals.authResult) {
      result = hrbac.can(guard);
    } else {
      assert(res);
      result = hrbac.can(guard, res.locals.authResult.actor);
    }

    if (!result) {
      throw new SrkError("unauthorized");
    }

    return next();
  };
