import { ListVisibility } from "common/enums";
import { IMemberPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import transformUserToSafeActor from "server/services/auth0-mgmt/transformUserToSafeActor";
import { SrkCookie } from "server/services/jwt";

export default async (
  authResult: SrkCookie,
  { username }: { username?: string }
): Promise<IMemberPayload> => {
  if (!username) {
    throw new SrkError("badRequest");
  }

  const targetUser = transformUserToSafeActor(
    await getUserCached({ username })
  );

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
    nickname: targetUser.nickname || username,
    avatar: targetUser.avatar,
    hasFriendRequest: self
      ? target.pendingIncomingFriends.includes(self)
      : false,
    isFriend: self ? target.confirmedFriends.includes(self) : false,
    isAcceptingFriends: targetUser.isAcceptingFriends,
    lists,
  };
};
