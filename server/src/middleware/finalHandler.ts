import { Request, Response, NextFunction } from "express";
import SrkError from "src/classes/SrkError";
import SrkResponse from "src/classes/SrkResponse";
import {
  declareResponse,
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
    declareResponse(res, new SrkResponse({ error }));
    return sendResponse(res);
  } else if (error instanceof SyntaxError) {
    // if it was a syntax error, then return it to user
    declareResponse(
      res,
      new SrkResponse({ error: new SrkError("syntaxError") })
    );
    return sendResponse(res);
  }

  // if it's an unknown error, throw a generic internal
  // eslint-disable-next-line no-console
  console.error("Unmanaged error:", error);
  declareResponse(
    res,
    new SrkResponse({ error: new SrkError("internalError") })
  );
  return sendResponse(res);
};
