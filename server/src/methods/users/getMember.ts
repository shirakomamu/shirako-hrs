import { IMemberPayload } from "common/types/api/users";
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
      ? DI.memberRepo.findOne(
          {
            sub: {
              $eq: authResult.actor.id,
            },
          },
          ["outgoingFriends", "incomingFriends", "destinationLists"]
        )
      : null,
    DI.memberRepo.findOneOrFail(
      {
        sub: {
          $eq: targetUser.id,
        },
      },
      ["outgoingFriends", "incomingFriends", "destinationLists"]
    ),
  ]);

  return {
    username,
    nickname: targetUser.nickname || username,
    avatar: targetUser.avatar,
    hasFriendRequest: self
      ? target.pendingIncomingFriends.includes(self)
      : false,
    isFriend: self ? target.confirmedFriends.includes(self) : false,
    isAcceptingFriends: targetUser.isAcceptingFriends,
    lists: [],
  };
};
