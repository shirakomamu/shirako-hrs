import { CreateFriendDto } from "common/dto/users";
import { IFriendStatusPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import _getIdentityMapFromUsername from "server/methods/users/_getIdentityMapFromUsername";
import getSelfFriendData from "./getSelfFriendData";

export default async (
  authResult: SrkCookie,
  { username }: CreateFriendDto
): Promise<IFriendStatusPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const usermap = await _getIdentityMapFromUsername([username]);
  const user = usermap[username];

  if (!user) {
    throw new SrkError("resourceInvalid");
  }

  const repo = DI.memberRepo;
  const friendRepo = DI.friendRequestRepo;

  const [self, target] = await Promise.all([
    repo.findOneOrFail({ sub: authResult.actor.id }),
    repo.findOneOrFail({ sub: user.id }),
  ]);

  const [existingOutgoing, existingIncoming] = await Promise.all([
    friendRepo.findOne({
      user: self,
      friend: target,
    }),
    friendRepo.findOne({
      user: target,
      friend: self,
    }),
  ]);

  // if there's no existing incoming and user isn't accepting friends, then error
  // this prevents new friend requests but allows acceptance of incoming ones
  if (!existingIncoming && !user.isAcceptingFriends) {
    throw new SrkError("badRequest");
  }

  if (!existingOutgoing) {
    const fr = friendRepo.create({
      user: self,
      friend: target,
    });

    await friendRepo.persistAndFlush(fr);
  }

  return await getSelfFriendData(authResult);
};
