import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import {
  createDestinationList,
  getDestinationList,
} from "server/methods/lists";
import {
  AddItemToListDto,
  CreateListDto,
  GetListDto,
  RemoveItemFromListDto,
} from "common/dto/lists";
import addItemToList from "server/methods/lists/addItemToList";
import removeItemFromList from "server/methods/lists/removeItemFromList";

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

  public addItemToList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await addItemToList(
      req.locals.authResult,
      req.params as AddItemToListDto
    );

    return new SrkResponse({ payload });
  };

  public removeItemFromList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await removeItemFromList(
      req.locals.authResult,
      req.params as RemoveItemFromListDto
    );

    return new SrkResponse({ payload });
  };
}
