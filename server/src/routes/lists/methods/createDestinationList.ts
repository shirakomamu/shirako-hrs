import { CreateListDto } from "common/dto/lists";
import SrkError from "server/classes/SrkError";
import getMemberFromActor from "server/composables/getMemberFromActor";
import { DestinationList } from "server/entities/DestinationList";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";

export default async (
  authResult: SrkCookie,
  { name, visibility }: CreateListDto
): Promise<DestinationList> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;

  const member = await getMemberFromActor(authResult.actor);

  const list = repo.create({
    owner: member,
    name,
    description: null,
    visibility,
  });

  await repo.persistAndFlush(list);

  return list;
};
