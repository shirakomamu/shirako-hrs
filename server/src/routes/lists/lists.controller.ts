import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import { createDestinationList } from "server/methods/lists";

export default class {
  public createDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await createDestinationList(
      req.locals.authResult,
      req.body
    );

    return new SrkResponse({ payload });
  };
}
