import { Request, Response, NextFunction } from "express";
import { SrkExpressResponse } from "src/services/jwt";
import { storage } from "src/services/mikro-orm";
import { DI } from "src/app";

export default (
  _req: Request,
  _res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  storage.run(DI.em.fork(true, true), next);
};
