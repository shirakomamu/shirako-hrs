import { NextFunction, Request, Response } from "express";
import { SrkExpressResponse } from "src/services/jwt";
import SrkError from "src/classes/SrkError";
import assert from "@@/common/utils/assert";
import { Guard } from "@@/common/types/hrbac";
import hrbacCan from "@@/common/utils/hrbacCan";

export default (guard: Guard) =>
  (_req: Request, res: Response | SrkExpressResponse, next: NextFunction) => {
    let result: boolean;
    if (!res.locals.authResult) {
      result = hrbacCan(guard);
    } else {
      assert<SrkExpressResponse>(res);
      result = hrbacCan(guard, res.locals.authResult.actor);
    }

    if (!result) {
      return next(new SrkError("unauthorized"));
    }

    return next();
  };
