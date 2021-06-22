import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";
import { identifyMyself } from "./methods";

export default class {
  public identifyMyself = (_req: Request, res: SrkExpressResponse) => {
    const payload = identifyMyself(res.locals.authResult);

    return new SrkResponse({ payload });
  };

  // public registerNewMember = async (req: Request, res: SrkExpressResponse) => {
  //   const payload = await registerNewMember(res.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };

  // public isNameAvailable = async (req: Request, res: SrkExpressResponse) => {
  //   const payload = await isNameAvailable(res.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };

  // public checkOtpToken = async (req: Request, res: SrkExpressResponse) => {
  //   const payload = await checkOtpToken(res.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };
}
