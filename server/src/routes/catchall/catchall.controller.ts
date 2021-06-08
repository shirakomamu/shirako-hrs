import { Request } from "express";
import SrkError from "src/classes/SrkError";
import { interfaces as JwtInterfaces } from "src/services/jwt";

export default class {
  public error404 = (_req: Request, _res: JwtInterfaces.SrkExpressResponse) => {
    throw new SrkError("badRoute");
  };
}
