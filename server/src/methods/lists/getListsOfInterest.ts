import { ListVisibility } from "common/enums";
import { IListsOfInterestPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import _getIdentityMapFromId from "server/methods/users/_getIdentityMapFromId";

export default async (
  authResult: SrkCookie
): Promise<IListsOfInterestPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const self = await DI.memberRepo.findOneOrFail({ sub: authResult.actor.id }, [
    "outgoingFriends",
    "incomingFriends",
  ]);

  const confirmedFriends = self?.confirmedFriends.map((e) => e.id) || [];

  const listsEntities = await DI.destinationListRepo.find(
    {
      owner: {
        $ne: self,
      },
      $or: [
        {
          visibility: ListVisibility.list,
          sharedWith: {
            $in: [self],
          },
          owner: {
            $in: confirmedFriends,
          },
        },
        // condition: visible to confirmed friends
        {
          visibility: ListVisibility.friends,
          owner: {
            $in: confirmedFriends,
          },
        },
      ],
    },
    ["owner"]
  );

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

  return { lists };
};
