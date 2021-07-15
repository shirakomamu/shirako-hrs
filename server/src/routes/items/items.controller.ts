import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import searchForDestinations from "server/methods/items/searchForDestinations";
import { BusinessIdentifyDto, BusinessSearchDto } from "common/dto/items";
import identifyDestination from "server/methods/items/identifyDestination";

export default class {
  public searchForDestinations = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await searchForDestinations(
      req.locals.authResult,
      req.body as BusinessSearchDto
    );

    return new SrkResponse({ payload });
  };

  public identifyDestination = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await identifyDestination(
      req.locals.authResult,
      req.params as BusinessIdentifyDto
    );

    return new SrkResponse({ payload });
  };
}
