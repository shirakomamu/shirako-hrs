import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";
import { RemoveItemFromListDto } from "common/dto/lists";
import getDestinationList from "./getDestinationList";

export default async (
  authResult: SrkCookie,
  { username, id, destinationId }: RemoveItemFromListDto
): Promise<IDestinationListPayload> => {
  if (!authResult.actor || authResult.actor.username !== username) {
    throw new SrkError("unauthorized");
  }

  const [list, destination] = await Promise.all([
    DI.destinationListRepo.findOneOrFail(
      {
        owner: {
          sub: authResult.actor.id,
        },
        id,
      },
      ["destinations"]
    ),
    DI.destinationItemRepo.findOneOrFail({
      yelpId: destinationId,
    }),
  ]);

  list.destinations.remove(destination);

  await DI.destinationListRepo.persistAndFlush(list);

  return await getDestinationList(authResult, { username, id });
};
