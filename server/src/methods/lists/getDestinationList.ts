import { GetListDto } from "common/dto/lists";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { ListVisibility } from "common/enums";
import { IDestinationListPayload, UserIdentity } from "common/types/api";
import _getIdentityMapFromId from "../users/_getIdentityMapFromId";
import mapItems from "./_mapItems";

export default async (
  authResult: SrkCookie,
  { username, id }: GetListDto
): Promise<IDestinationListPayload> => {
  const repo = DI.destinationListRepo;
  const memberRepo = DI.memberRepo;

  const [targetUser, user] = await Promise.all([
    getUserCached({ username }),
    authResult.actor
      ? memberRepo.findOne({ sub: authResult.actor.id }, [
          "outgoingFriends",
          "incomingFriends",
        ])
      : null,
  ]);

  const confirmedFriends = user?.confirmedFriends.map((e) => e.id) || [];
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

  if (user) {
    orArray.push(
      // condition: visible to shared list
      {
        visibility: ListVisibility.list,
        sharedWith: {
          $in: [user], // it's like this so that it doesn't filter to only this share, allowing user enumeration
        },
      },
      // condition: owner
      {
        owner: user,
      }
    );
  }

  // console.log("OR CONDITIONS", orArray);

  const list = await repo.findOneOrFail(
    {
      id,
      owner: {
        sub: targetUser.user_id || "",
      },
      $or: orArray,
    },
    ["destinations", "sharedWith"]
  );

  const users: Omit<UserIdentity, "id">[] = [];
  if (username === authResult.actor?.username) {
    const sharedWithSubs = list.sharedWith.getItems().map((e) => e.sub);
    const sharedWithMap = await _getIdentityMapFromId(sharedWithSubs);

    for (const sub of sharedWithSubs) {
      const identity = sharedWithMap[sub];

      if (!identity) continue;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = identity;

      users.push(rest);
    }
  }

  return {
    id: list.id,
    name: list.name,
    owner: username,
    description: list.description,
    visibility: list.visibility,
    items: mapItems(list.destinations.getItems()),
    users,
  };
};
