import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { interfaces as JwtInterfaces } from "src/services/jwt";

export default class {
  public listCats = (_req: Request, res: JwtInterfaces.SrkExpressResponse) => {
    const payload = ["Cat 1", "Cat 2"];

    return new SrkResponse(res, { payload });
  };

  public createCat = (_req: Request, res: JwtInterfaces.SrkExpressResponse) => {
    const payload = "Cat was created";

    return new SrkResponse(res, { payload });
  };
}
