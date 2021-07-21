import { SearchListsDto } from "common/dto/lists";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { ListVisibility } from "common/enums";
import { IDestinationListsPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";

export default async (
  authResult: SrkCookie,
  { keyword }: SearchListsDto
): Promise<IDestinationListsPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;
  const memberRepo = DI.memberRepo;

  const user = await memberRepo.findOneOrFail({ sub: authResult.actor?.id }, [
    "outgoingFriends",
    "incomingFriends",
  ]);

  const confirmedFriends = user.confirmedFriends.map((e) => e.id) || [];

  const lists = await repo.find(
    {
      $and: [
        // keyword
        {
          $or: [
            {
              name: {
                $ilike: `%${keyword}%`,
              },
            },
            {
              description: {
                $ilike: `%${keyword}%`,
              },
            },
          ],
        },

        // visibility rules
        {
          $or: [
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
            // condition: visible to shared list
            {
              visibility: ListVisibility.list,
              sharedWith: user,
            },
            // condition: owner
            {
              owner: user,
            },
          ],
        },
      ],
    },
    ["sharedWith"],
    undefined, // order by
    5, // limit
    0 // offset
  );

  const distinctOwners = lists
    .map((e) => e.owner.sub)
    .filter((e, i, a) => a.indexOf(e) === i);

  const identifiedOwners = (
    await Promise.all(distinctOwners.map((e) => getUserCached({ id: e })))
  ).map((e) => e.username || "n/a");

  return {
    lists: lists.map((list) => ({
      id: list.id,
      name: list.name,
      owner: identifiedOwners[distinctOwners.indexOf(list.owner.sub)],
      description: list.description,
      visibility: list.visibility,
      // items: mapItems(list.destinations.getItems()),
    })),
  };
};
