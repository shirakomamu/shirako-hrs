import { IFriendStatusPayload, UserIdentity } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import getIdentityMapFromId from "server/methods/users/_getIdentityMapFromId";
import { FriendStatus } from "common/enums";

export default async (authResult: SrkCookie): Promise<IFriendStatusPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.memberRepo;

  const me = await repo.findOneOrFail(
    {
      sub: authResult.actor.id,
    },
    [
      "outgoingFriends",
      "incomingFriends",
      "outgoingFriends.friend",
      "incomingFriends.user",
    ] // .friend and .user required for getting sub number
  );

  const friendData = me.friendData;
  const usermap = await getIdentityMapFromId(
    friendData.map((e) => e.member.sub)
  );

  const friendResult: {
    user: Omit<UserIdentity, "id">;
    status: FriendStatus;
  }[] = [];

  for (const friend of friendData) {
    const identityResult = usermap[friend.member.sub];
    if (!identityResult) continue;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = identityResult;

    friendResult.push({
      user: rest,
      status: friend.status,
    });
  }

  return { users: friendResult };
};
