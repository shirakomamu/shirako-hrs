import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { SrkExpressResponse } from "src/services/jwt";
import ormService from "src/services/mikro-orm";

export default async (
  _req: Request,
  _res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  const orm = await ormService;
  RequestContext.create(orm.em, next);
  // next();
};
