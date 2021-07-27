import { DeleteFriendDto } from "common/dto/users";
import { IFriendStatusPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { SrkCookie } from "server/services/jwt";
import getSelfFriendData from "./getSelfFriendData";

export default async (
  authResult: SrkCookie,
  { username }: DeleteFriendDto
): Promise<IFriendStatusPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const user = await getUserCached({ username });

  const repo = DI.memberRepo;
  const friendRepo = DI.friendRequestRepo;

  const [self, target] = await Promise.all([
    repo.findOneOrFail({ sub: authResult.actor.id }),
    repo.findOneOrFail({ sub: user.user_id }),
  ]);

  const existingFriends = await friendRepo.find({
    $or: [
      {
        user: self,
        friend: target,
      },
      {
        friend: self,
        user: target,
      },
    ],
  });

  if (existingFriends.length) {
    await friendRepo.removeAndFlush(existingFriends);
  }

  return await getSelfFriendData(authResult);
};
