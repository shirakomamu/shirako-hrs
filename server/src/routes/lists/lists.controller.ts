import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import {
  createDestinationList,
  getDestinationList,
  getDestinationListsByUsername,
} from "server/methods/lists";
import { CreateListDto, GetListDto, GetListsDto } from "common/dto/lists";

export default class {
  public createDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await createDestinationList(
      req.locals.authResult,
      req.body as CreateListDto
    );

    return new SrkResponse({ payload });
  };

  public getDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await getDestinationList(
      req.locals.authResult,
      req.params as GetListDto
    );

    return new SrkResponse({ payload });
  };

  public getDestinationListsByUsername = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await getDestinationListsByUsername(
      req.locals.authResult,
      req.params as GetListsDto
    );

    return new SrkResponse({ payload });
  };
}
