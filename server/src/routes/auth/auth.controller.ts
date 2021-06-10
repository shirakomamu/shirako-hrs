import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";
import registerNewMember from "./services/registerNewMember";

export default class {
  public registerNewMember = async (req: Request, res: SrkExpressResponse) => {
    const payload = await registerNewMember(res.locals.authResult, req.body);

    return new SrkResponse(res, { payload });
  };
}
