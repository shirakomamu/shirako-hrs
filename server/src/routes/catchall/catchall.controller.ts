import { NextFunction } from "express";
import SrkError from "server/classes/SrkError";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";

export default class {
  public error404 = (
    _req: SrkExpressRequest,
    _res: SrkExpressResponse,
    _next: NextFunction
  ) => {
    throw new SrkError("badRoute");
  };
}
