import { Request, Response, NextFunction } from "express";
import { SrkExpressResponse } from "src/services/jwt";
import { storage } from "src/services/mikro-orm";
import { DI } from "src/app";

export default async (
  _req: Request,
  _res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  storage.run((await DI.orm).em.fork(true, true), next);
};
