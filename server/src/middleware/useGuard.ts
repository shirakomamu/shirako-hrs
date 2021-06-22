import { NextFunction, Request, Response } from "express";
import hrbac from "src/services/hrbac";
import { Guard } from "src/services/guard";
import { SrkExpressResponse } from "src/services/jwt";
import SrkError from "src/classes/SrkError";
import assert from "@@/common/utils/assert";

export default (guard: Guard) =>
  async (
    _req: Request,
    res: Response | SrkExpressResponse,
    next: NextFunction
  ) => {
    let result: boolean;
    if (!res.locals.authResult) {
      result = await hrbac.can(guard);
    } else {
      assert<SrkExpressResponse>(res);
      result = await hrbac.can(guard, res.locals.authResult.actor);
    }

    if (!result) {
      return next(new SrkError("unauthorized"));
    }

    return next();
  };
