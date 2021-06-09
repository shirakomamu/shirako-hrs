import { Request } from "express";
import SrkError from "src/classes/SrkError";
import { SrkExpressResponse } from "src/services/jwt";

export default class {
  public error404 = (_req: Request, _res: SrkExpressResponse) => {
    throw new SrkError("badRoute");
  };
}
