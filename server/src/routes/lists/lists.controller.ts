import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import {
  AddItemToListDto,
  CreateListDto,
  EditListDto,
  GetListDto,
  RemoveItemFromListDto,
  SearchListsDto,
} from "common/dto/lists";
import addItemToList from "server/methods/lists/addItemToList";
import removeItemFromList from "server/methods/lists/removeItemFromList";
import editDestinationList from "server/methods/lists/editDestinationList";
import deleteDestinationList from "server/methods/lists/deleteDestinationList";
import searchDestinationLists from "server/methods/lists/searchDestinationLists";
import createDestinationList from "server/methods/lists/createDestinationList";
import getDestinationList from "server/methods/lists/getDestinationList";

export default class {
  public searchDestinationLists = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await searchDestinationLists(
      req.locals.authResult,
      req.query as SearchListsDto
    );

    return new SrkResponse({ payload });
  };

  public createDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await createDestinationList(
      req.locals.authResult,
      req.body as CreateListDto
    );

    return new SrkResponse({
      payload,
      status: 201,
      headers: { Location: `/lists/${payload.owner}/${payload.id}` },
    });
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

  public editDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await editDestinationList(
      req.locals.authResult,
      req.params as GetListDto,
      req.body as EditListDto
    );

    return new SrkResponse({ payload });
  };

  public deleteDestinationList = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await deleteDestinationList(
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
