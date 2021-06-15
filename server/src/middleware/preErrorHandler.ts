/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { SrkExpressResponse } from "src/services/jwt";
import errorHandler from "./errorHandler";

export default (
  err: Error,
  req: Request,
  res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  if (err) {
    return errorHandler(err, req, res, next);
  }
  next();
};
