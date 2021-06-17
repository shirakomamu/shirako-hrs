import { Request, Response, NextFunction } from "express";
import SrkResponse from "src/classes/SrkResponse";
import {
  sendResponse,
  SrkExpressResponse,
  WithSrkExpressResponse,
} from "src/services/jwt";

export default (
  _req: Request,
  res: Response | SrkExpressResponse | WithSrkExpressResponse,
  next: NextFunction
) => {
  if (res.locals.controllerResult instanceof SrkResponse) {
    return sendResponse(res as WithSrkExpressResponse);
  } else {
    next();
  }
};
