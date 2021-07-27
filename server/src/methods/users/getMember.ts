import { ListVisibility } from "common/enums";
import { IMemberPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import _getIdentityMapFromUsername from "server/methods/auth/_getIdentityMapFromUsername";

export default async (
  authResult: SrkCookie,
  { username }: { username?: string }
): Promise<IMemberPayload> => {
  if (!username) {
    throw new SrkError("badRequest");
  }

  const targetUserMap = await _getIdentityMapFromUsername([username]);
  const targetUser = targetUserMap[username];

  if (!targetUser) {
    throw new SrkError("resourceInvalid");
  }

  const [self, target] = await Promise.all([
    authResult.actor
      ? DI.memberRepo.findOne({
          sub: authResult.actor.id,
        })
      : null,
    DI.memberRepo.findOneOrFail(
      {
        sub: targetUser.id,
      },
      ["outgoingFriends", "incomingFriends", "destinationLists"]
    ),
  ]);

  const lists = target.destinationLists
    .getItems()
    .filter((e) => {
      if (e.owner === self) return true;
      if (e.visibility === ListVisibility.anyone) return true;
      if (
        self &&
        e.visibility === ListVisibility.friends &&
        target.confirmedFriends.includes(self)
      )
        return true;
      if (
        self &&
        e.visibility === ListVisibility.list &&
        e.sharedWith.contains(self)
      )
        return true;
      return false;
    })
    .map((e) => ({
      id: e.id,
      owner: username, // it's a hack to get username because it's always self
      name: e.name,
      description: e.description,
      visibility: e.visibility,
    }));

  return {
    username,
    nickname: targetUser.nickname,
    avatar: targetUser.avatar,
    isAcceptingFriends: targetUser.isAcceptingFriends,
    lists,
  };
};
