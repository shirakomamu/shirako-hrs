import { Request, Response, NextFunction } from "express";
import SrkResponse from "server/classes/SrkResponse";
import {
  sendResponse,
  SrkExpressResponse,
  WithSrkExpressResponse,
} from "server/services/jwt";

export default (
  _req: Request,
  res: Response | SrkExpressResponse | WithSrkExpressResponse,
  next: NextFunction
) => {
  if (res.locals.controllerResult instanceof SrkResponse) {
    return sendResponse(res as WithSrkExpressResponse);
  } else {
    // going to force a 404
    next();
  }
};
