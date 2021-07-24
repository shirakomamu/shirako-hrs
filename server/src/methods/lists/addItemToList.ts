import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";
import { AddItemToListDto } from "common/dto/lists";
import { MAX_ITEMS_PER_LIST } from "server/config/dataLimits";
import identifyDestination from "../items/identifyDestination";
import mapItems from "./_mapItems";

export default async (
  authResult: SrkCookie,
  { username, id, destinationId }: AddItemToListDto
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
    identifyDestination(authResult, {
      id: destinationId,
    }),
  ]);

  // can sometimes exceed limits when there's many concurrent requests
  if (list.destinations.length >= MAX_ITEMS_PER_LIST) {
    throw new SrkError("badRequest");
  }

  list.destinations.add(
    await DI.destinationItemRepo.findOneOrFail({ yelpId: destination.id })
  );

  await DI.destinationListRepo.persistAndFlush(list);

  return {
    id: list.id,
    name: list.name,
    owner: authResult.actor.username,
    description: list.description,
    visibility: list.visibility,
    items: mapItems(list.destinations.getItems()),
  };
};
