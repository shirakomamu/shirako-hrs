import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";
import { AddUserToListDto } from "common/dto/lists";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { ListVisibility } from "common/enums";
import getDestinationList from "./getDestinationList";

export default async (
  authResult: SrkCookie,
  { username, id, targetUsername }: AddUserToListDto
): Promise<IDestinationListPayload> => {
  if (!authResult.actor || authResult.actor.username !== username) {
    throw new SrkError("unauthorized");
  }
  if (targetUsername === username) {
    throw new SrkError("badRequest");
  }

  const [list, targetUser] = await Promise.all([
    DI.destinationListRepo.findOneOrFail(
      {
        owner: {
          sub: authResult.actor.id,
        },
        id,
        visibility: ListVisibility.list,
      },
      ["sharedWith"]
    ),
    getUserCached({ username: targetUsername }),
  ]);

  const targetUserDb = await DI.memberRepo.findOneOrFail({
    sub: targetUser.user_id || "",
  });

  list.sharedWith.remove(targetUserDb);

  await DI.destinationListRepo.persistAndFlush(list);

  return await getDestinationList(authResult, { username, id });
};
