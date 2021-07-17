import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";
import { AddItemToListDto } from "common/dto/lists";
import identifyDestination from "../items/identifyDestination";

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
      ["destinations", "sharedWith"]
    ),
    identifyDestination(authResult, {
      id: destinationId,
    }),
  ]);

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
    items: list.destinations.getItems().map((e) => ({
      id: e.yelpId,
      name: e.name,
      url: e.url,
      price: e.price,
      rating: e.rating,
      review_count: e.review_count,
      display_address: e.display_address,
      display_phone: e.display_phone,
      lastUpdated: e.updatedAt.getTime(),
      hours: e.hours,
      special_hours: e.special_hours,
    })),
  };
};
