/* eslint-disable no-console */
import { Request, Response, NextFunction } from "express";
import SrkError from "src/classes/SrkError";
import SrkResponse from "src/classes/SrkResponse";
import {
  sendResponse,
  SrkExpressResponse,
  WithSrkExpressResponse,
} from "src/services/jwt";

export default (
  error: Error | SrkError | null,
  _req: Request,
  res: Response | SrkExpressResponse | WithSrkExpressResponse,
  _next: NextFunction
) => {
  if (error instanceof SrkError) {
    // if it's a managed error, then return it to user
    return sendResponse(res, new SrkResponse({ error }));
  } else if (error instanceof SyntaxError) {
    return sendResponse(
      res,
      new SrkResponse({ error: new SrkError("syntaxError") })
    );
  } else if (!res.locals.controllerResult) {
    // if it's an undeclared error, also throw a generic internal
    console.error("No result error");
    return sendResponse(
      res,
      new SrkResponse({ error: new SrkError("internalError") })
    );
  }

  // if it's an unknown error, throw a generic internal
  console.error("Unmanaged error:", error);
  return sendResponse(
    res,
    new SrkResponse({ error: new SrkError("internalError") })
  );
};
