import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";
import {
  registerNewMember,
  isNameAvailable,
  checkPageAccess,
  checkOtpToken,
} from "./methods";

export default class {
  public registerNewMember = async (req: Request, res: SrkExpressResponse) => {
    const payload = await registerNewMember(res.locals.authResult, req.body);

    return new SrkResponse({ payload });
  };

  public isNameAvailable = async (req: Request, res: SrkExpressResponse) => {
    const payload = await isNameAvailable(res.locals.authResult, req.body);

    return new SrkResponse({ payload });
  };

  public checkPageAccess = (req: Request, res: SrkExpressResponse) => {
    const payload = checkPageAccess(res.locals.authResult, req.body);

    return new SrkResponse({ payload });
  };

  public checkOtpToken = async (req: Request, res: SrkExpressResponse) => {
    const payload = await checkOtpToken(res.locals.authResult, req.body);

    return new SrkResponse({ payload });
  };
}
