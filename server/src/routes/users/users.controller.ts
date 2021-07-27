import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import getMember from "server/methods/users/getMember";
import getSelfFriendData from "server/methods/users/getSelfFriendData";
import createFriendLink from "server/methods/users/createFriendLink";
import deleteFriendLink from "server/methods/users/deleteFriendLink";
import {
  CreateFriendDto,
  DeleteFriendDto,
  GetMemberDto,
} from "common/dto/users";

export default class {
  public getMember = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await getMember(
      req.locals.authResult,
      req.params as GetMemberDto
    );

    return new SrkResponse({ payload });
  };

  public getSelfFriendData = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await getSelfFriendData(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public createFriendLink = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await createFriendLink(
      req.locals.authResult,
      req.body as CreateFriendDto
    );

    return new SrkResponse({ payload });
  };

  public deleteFriendLink = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await deleteFriendLink(
      req.locals.authResult,
      req.body as DeleteFriendDto
    );

    return new SrkResponse({ payload });
  };
}
