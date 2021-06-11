/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import SrkError from "src/classes/SrkError";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";

export default (
  error: Error | SrkError,
  _req: Request,
  res: Response | SrkExpressResponse,
  _next: NextFunction
) => {
  if (error instanceof SrkError) {
    // if it's a managed error, then return it to user
    return new SrkResponse(res, { error });
  } else if (error instanceof SyntaxError) {
    return new SrkResponse(res, { error: new SrkError("syntaxError") });
  } else {
    // if it's an unknown error, throw a generic internal
    console.error("Unmanaged error:", error);
    return new SrkResponse(res, { error: new SrkError("internalError") });
  }
};
