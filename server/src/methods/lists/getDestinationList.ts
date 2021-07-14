import { GetListDto } from "common/dto/lists";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import transformUserToSafeActor from "server/services/auth0-mgmt/transformUserToSafeActor";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { ListVisibility } from "common/enums";
import { IDestinationListPayload } from "common/types/api";

export default async (
  authResult: SrkCookie,
  { username, id }: GetListDto
): Promise<IDestinationListPayload> => {
  const repo = DI.destinationListRepo;
  const memberRepo = DI.memberRepo;

  const [targetUserCached, user] = await Promise.all([
    getUserCached({ username }),
    authResult.actor
      ? memberRepo.findOne({ sub: authResult.actor.id }, [
          "outgoingFriends",
          "incomingFriends",
        ])
      : null,
  ]);

  const confirmedFriends = user?.confirmedFriends.map((e) => e.id) || [];

  const targetUser = transformUserToSafeActor(targetUserCached);

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
        sharedWith: user,
      },
      // condition: owner
      {
        owner: user,
      }
    );
  }

  const list = await repo.findOneOrFail(
    {
      id,
      owner: {
        sub: targetUser.id,
      },
      $or: orArray,
    },
    ["destinations", "sharedWith"]
  );

  return {
    id: list.id,
    name: list.name,
    owner: username,
    description: list.description,
    visibility: list.visibility,
    items: list.destinations.getItems().map((e) => ({
      id: e.yelpId,
    })),
  };
};
