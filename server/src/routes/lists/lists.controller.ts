import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import {
  createDestinationList,
  getDestinationList,
} from "server/methods/lists";
import { CreateListDto, GetListDto } from "common/dto/lists";

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
}
