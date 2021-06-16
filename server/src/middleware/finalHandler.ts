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
  if (res.locals.controllerResult instanceof SrkResponse) {
    return sendResponse(res as WithSrkExpressResponse);
  } else if (error instanceof SrkError) {
    // if it's a managed error, then return it to user
    declareResponse(res, new SrkResponse({ error }));
    return sendResponse(res);
  } else if (error instanceof SyntaxError) {
    declareResponse(
      res,
      new SrkResponse({ error: new SrkError("syntaxError") })
    );
    return sendResponse(res);
  } else if (!res.locals.controllerResult) {
    // if it's an undeclared error, also throw a generic internal
    // eslint-disable-next-line no-console
    console.error("No result error");
    declareResponse(
      res,
      new SrkResponse({ error: new SrkError("internalError") })
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
