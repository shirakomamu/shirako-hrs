import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
// import sendgrid from "server/services/sendgrid";

export default class {
  public listCats = (_req: SrkExpressRequest, _res: SrkExpressResponse) => {
    const payload = ["Cat 1", "Cat 2"];

    console.log(_req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public createCat = (_req: SrkExpressRequest, _res: SrkExpressResponse) => {
    const payload = "Cat was created";

    return new SrkResponse({ payload });
  };
}
