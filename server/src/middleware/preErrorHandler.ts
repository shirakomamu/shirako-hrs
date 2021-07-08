/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { SrkExpressResponse } from "server/services/jwt";
import finalHandler from "./finalHandler";

export default (
  err: Error | null,
  req: Request,
  res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  if (err) {
    return finalHandler(err, req, res, next);
  }
  next();
};
