import { EditListDto, GetListDto } from "common/dto/lists";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";
import mapItems from "./_mapItems";

export default async (
  authResult: SrkCookie,
  { username, id }: GetListDto,
  { name, description, visibility }: EditListDto
): Promise<IDestinationListPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }
  if (username !== authResult.actor.username) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;

  const list = await repo.findOneOrFail(
    {
      id,
    },
    ["destinations"]
  );

  list.name = name || list.name;
  list.description =
    typeof description === "undefined" ? list.description : description;
  list.visibility = visibility || list.visibility;

  await repo.persistAndFlush(list);

  return {
    id: list.id,
    name: list.name,
    owner: authResult.actor.username,
    description: list.description,
    visibility: list.visibility,
    items: mapItems(list.destinations.getItems()),
  };
};
