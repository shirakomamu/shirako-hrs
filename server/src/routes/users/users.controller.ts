import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import getMember from "server/methods/users/getMember";

export default class {
  public getMember = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await getMember(req.locals.authResult, req.params);

    return new SrkResponse({ payload });
  };
}
