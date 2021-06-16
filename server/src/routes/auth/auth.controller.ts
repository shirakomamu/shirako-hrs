import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { declareResponse, SrkExpressResponse } from "src/services/jwt";
import { registerNewMember, isNameAvailable, checkPageAccess } from "./methods";

export default class {
  public registerNewMember = async (req: Request, res: SrkExpressResponse) => {
    const payload = await registerNewMember(res.locals.authResult, req.body);

    declareResponse(res, new SrkResponse({ payload }));
  };

  public isNameAvailable = async (req: Request, res: SrkExpressResponse) => {
    const payload = await isNameAvailable(res.locals.authResult, req.body);

    declareResponse(res, new SrkResponse({ payload }));
  };

  public checkPageAccess = (req: Request, res: SrkExpressResponse) => {
    const payload = checkPageAccess(res.locals.authResult, req.body);

    declareResponse(res, new SrkResponse({ payload }));
  };
}
