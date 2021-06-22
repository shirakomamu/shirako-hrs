import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";
// import sendgrid from "src/services/sendgrid";

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
