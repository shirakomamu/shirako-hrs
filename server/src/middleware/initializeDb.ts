import { Request, Response, NextFunction } from "express";
import { storage } from "server/services/mikro-orm";
import { DI } from "server/app";

export default async (_req: Request, _res: Response, next: NextFunction) => {
  storage.run((await DI.orm).em.fork(true, true), next);
};
