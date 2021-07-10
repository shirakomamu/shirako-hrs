/* eslint-disable no-console */
import { NextFunction, Request } from "express";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import finalHandler from "./finalHandler";

export default (
  err: Error | null,
  req: Request | SrkExpressRequest,
  res: SrkExpressResponse,
  next: NextFunction
) => {
  if (err) {
    return finalHandler(err, req, res, next);
  }
  next();
};
