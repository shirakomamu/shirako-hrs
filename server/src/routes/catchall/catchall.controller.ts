import { NextFunction, Request, Response } from "express";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse, WithSrkExpressResponse } from "src/services/jwt";

export default class {
  public error404 = (
    _req: Request,
    _res: Response | SrkExpressResponse | WithSrkExpressResponse,
    _next: NextFunction
  ) => {
    throw new SrkError("badRoute");
  };
}
