import { Request } from "express";
import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressResponse } from "server/services/jwt";
// import sendgrid from "server/services/sendgrid";

export default class {
  public listCats = (_req: Request, _res: SrkExpressResponse) => {
    const payload = ["Cat 1", "Cat 2"];

    console.log(_res.locals.authResult);

    return new SrkResponse({ payload });
  };

  public createCat = (_req: Request, _res: SrkExpressResponse) => {
    const payload = "Cat was created";

    return new SrkResponse({ payload });
  };
}
