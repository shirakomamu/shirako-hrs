import { Request, Response, NextFunction } from "express";
import SrkResponse from "server/classes/SrkResponse";
import {
  sendResponse,
  SrkExpressRequest,
  SrkExpressResponse,
} from "server/services/jwt";

export default (
  _req: Request | SrkExpressRequest,
  res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  if (res.locals.controllerResult instanceof SrkResponse) {
    return sendResponse(res as SrkExpressResponse);
  } else {
    // going to force a 404
    next();
  }
};
