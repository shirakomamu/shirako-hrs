import { CreateListDto } from "common/dto/lists";
import SrkError from "server/classes/SrkError";
import getMemberFromActor from "server/methods/users/_getMemberFromActor";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { IDestinationListPayload } from "common/types/api";

export default async (
  authResult: SrkCookie,
  { name, description, visibility }: CreateListDto
): Promise<IDestinationListPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;

  const member = await getMemberFromActor(authResult);

  const list = repo.create({
    owner: member,
    name,
    description,
    visibility,
  });

  await repo.persistAndFlush(list);

  return {
    id: list.id,
    name: list.name,
    owner: authResult.actor.username,
    description: list.description,
    visibility: list.visibility,
    items: [],
    users: [],
  };
};
