import { Request, Response, NextFunction } from "express";
import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { SrkExpressResponse } from "server/services/jwt";
import ormService, { storage } from "server/services/mikro-orm";
import { Member } from "server/entities/Member";
import { DestinationList } from "../entities/DestinationList";

export const DI = {} as {
  orm: Promise<MikroORM>;
  em: EntityManager;
  memberRepo: EntityRepository<Member>;
  destinationListRepo: EntityRepository<DestinationList>;
};

let initialized: boolean = false;

DI.orm = ormService;

// Require orm to init
export default async (
  _req: Request,
  _res: Response | SrkExpressResponse,
  next: NextFunction
) => {
  if (!initialized) {
    const migrator = (await DI.orm).getMigrator();
    if (process.env.NODE_ENV !== "production") {
      await migrator.createMigration();
    }
    await migrator.up();

    DI.em = (await DI.orm).em as EntityManager;
    DI.memberRepo = DI.em.getRepository(Member);
    DI.destinationListRepo = DI.em.getRepository(DestinationList);

    initialized = true;
  }
  storage.run((await DI.orm).em.fork(true, true), next);
};
