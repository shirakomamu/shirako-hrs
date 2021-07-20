import { GetListDto } from "common/dto/lists";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";

export default async (
  authResult: SrkCookie,
  { username, id }: GetListDto
): Promise<void> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }
  if (username !== authResult.actor.username) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;

  const list = await repo.findOneOrFail({
    id,
  });

  await repo.removeAndFlush(list);
};
