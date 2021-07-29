import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import deleteUser from "server/services/auth0-mgmt/deleteUser";
import { DI } from "server/middleware/initializeDi";
import sendgrid from "server/services/sendgrid";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";

export default async (authResult: SrkCookie): Promise<void> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const self = await DI.memberRepo.findOneOrFail({ sub: authResult.actor.id });

  await DI.em.begin();
  try {
    DI.em.remove(self);
    await deleteUser(authResult.actor.id);
    DI.em.commit();
  } catch (e) {
    DI.em.rollback();
  }

  if (hrbacCan({ roles: [Role._email_verified] }, authResult.actor)) {
    await sendgrid.sendAccountDeletionConfirmation({
      email: authResult.actor.email,
      name: authResult.actor.username,
    });
  }
};
