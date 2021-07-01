import { Request, Response, NextFunction } from "express";
import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { SrkExpressResponse } from "src/services/jwt";
import ormService, { storage } from "src/services/mikro-orm";
import { Member } from "src/entities/Member";
import { MemberVerification } from "src/entities/MemberVerification";

export const DI = {} as {
  orm: Promise<MikroORM>;
  em: EntityManager;
  memberRepo: EntityRepository<Member>;
  memberVerificationRepo: EntityRepository<MemberVerification>;
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
    await migrator.createMigration();
    await migrator.up();

    DI.em = (await DI.orm).em as EntityManager;
    DI.memberRepo = DI.em.getRepository(Member);
    DI.memberVerificationRepo = DI.em.getRepository(MemberVerification);

    initialized = true;
  }
  storage.run((await DI.orm).em.fork(true, true), next);
};
