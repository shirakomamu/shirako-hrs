import { ListVisibility } from "common/enums";
import { IMemberPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import _getIdentityMapFromUsername from "server/methods/users/_getIdentityMapFromUsername";

export default async (
  authResult: SrkCookie,
  { username }: { username?: string }
): Promise<IMemberPayload> => {
  if (!username) {
    throw new SrkError("badRequest");
  }

  const [targetUserMap, self] = await Promise.all([
    _getIdentityMapFromUsername([username]),
    authResult.actor
      ? DI.memberRepo.findOne({ sub: authResult.actor.id }, [
          "outgoingFriends",
          "incomingFriends",
        ])
      : null,
  ]);
  const targetUser = targetUserMap[username];

  if (!targetUser) {
    throw new SrkError("resourceInvalid");
  }

  const confirmedFriends = self?.confirmedFriends.map((e) => e.id) || [];
  const orArray: object[] = [
    // condition: visible to anyone
    {
      visibility: ListVisibility.anyone,
    },
    // condition: visible to confirmed friends
    {
      visibility: ListVisibility.friends,
      owner: {
        $in: confirmedFriends,
      },
    },
  ];

  if (self) {
    orArray.push(
      // condition: visible to shared list
      {
        visibility: ListVisibility.list,
        sharedWith: self,
      },
      // condition: owner
      {
        owner: self,
      }
    );
  }

  const listsEntities = await DI.destinationListRepo.find({
    owner: {
      sub: targetUser.id,
    },
    $or: orArray,
  });

  const lists = listsEntities.map((e) => ({
    id: e.id,
    owner: targetUser.username,
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
