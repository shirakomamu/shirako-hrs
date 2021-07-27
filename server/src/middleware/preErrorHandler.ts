/* eslint-disable no-console */
import { NextFunction, Request } from "express";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";

export default (
  err: Error | null,
  _req: Request | SrkExpressRequest,
  _res: SrkExpressResponse,
  next: NextFunction
) => {
  if (err) {
    return next(err);
  }
  next();
};
