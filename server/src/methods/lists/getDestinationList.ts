import { GetListDto } from "common/dto/lists";
import SrkError from "server/classes/SrkError";
import { DestinationList } from "server/entities/DestinationList";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import transformUserToSafeActor from "server/services/auth0-mgmt/transformUserToSafeActor";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import { ListVisibility } from "common/enums";
import getMemberFromActor from "../users/getMemberFromActor";

export default async (
  authResult: SrkCookie,
  { username, id }: GetListDto
): Promise<DestinationList> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;

  const [targetUserCached, user] = await Promise.all([
    getUserCached({ username }),
    getMemberFromActor(authResult),
  ]);

  const targetUser = transformUserToSafeActor(targetUserCached);

  const list = await repo.findOneOrFail(
    {
      id: {
        $eq: id,
      },
      owner: {
        sub: {
          $eq: targetUser.id,
        },
      },
      $or: [
        // condition: visible to anyone
        {
          visibility: {
            $eq: ListVisibility.anyone,
          },
        },
        // condition: visible to confirmed friends
        {
          visibility: {
            $eq: ListVisibility.friends,
          },
          owner: {
            confirmedFriends: {
              $contains: user,
            },
          },
        },
        // condition: visible to shared list
        {
          visibility: {
            $eq: ListVisibility.list,
          },
          sharedWith: {
            $contains: user,
          },
        },
        // condition: owner
        {
          owner: {
            $eq: user,
          },
        },
      ],
    },
    ["destinations", "sharedWith", "owner.confirmedFriends"]
  );

  return list;
};
