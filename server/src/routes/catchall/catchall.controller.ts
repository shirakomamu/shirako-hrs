import { NextFunction } from "express";
import SrkError from "server/classes/SrkError";
import {
  SrkExpressRequest,
  SrkExpressResponse,
  WithSrkExpressResponse,
} from "server/services/jwt";

export default class {
  public error404 = (
    _req: SrkExpressRequest,
    _res: SrkExpressResponse | WithSrkExpressResponse,
    _next: NextFunction
  ) => {
    throw new SrkError("badRoute");
  };
}
