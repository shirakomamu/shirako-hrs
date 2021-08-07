import { ListVisibility } from "common/enums";
import { IMemberPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import _getIdentityMapFromUsername from "server/methods/users/_getIdentityMapFromUsername";
import _getIdentityMapFromId from "./_getIdentityMapFromId";

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
      ? DI.memberRepo.findOneOrFail({ sub: authResult.actor.id }, [
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
  const orArray: object[] = [];

  // if the user is logged in, then...
  if (self) {
    orArray.push(
      // condition: visible to shared list
      {
        visibility: ListVisibility.list,
        sharedWith: {
          $in: [self],
        },
      },
      // condition: owner
      {
        owner: {
          $in: [self], // otherwise "owner" can't be populated if it's not self...
        },
      }
    );
  }

  orArray.push(
    // condition: visible to confirmed friends
    {
      visibility: ListVisibility.friends,
      owner: {
        $in: confirmedFriends,
      },
    },
    // condition: visible to anyone
    {
      visibility: ListVisibility.anyone,
    }
  );

  const jointCondition: { [key: string]: any } = {};

  // only get lists owned by this user
  jointCondition.owner = { sub: targetUser.id };
  jointCondition.$or = orArray;

  const listsEntities = await DI.destinationListRepo.find(jointCondition, [
    "owner",
  ]);

  const usermap = await _getIdentityMapFromId(
    listsEntities.map((e) => e.owner.sub)
  );

  const lists = listsEntities.map((e) => ({
    id: e.id,
    owner: usermap[e.owner.sub]?.username || "n/a",
    // owner: targetUser.username, // not applicable anymore if possible to get other users' lists
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
