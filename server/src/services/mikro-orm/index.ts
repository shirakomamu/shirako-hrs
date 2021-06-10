import { AsyncLocalStorage } from "async_hooks";
import {
  MikroORM,
  EntityManager,
  IPrimaryKey,
  Dictionary,
} from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import SrkError from "src/classes/SrkError";
import { BaseEntity, ApiKey, Member } from "./entities";

const storage = new AsyncLocalStorage<EntityManager>();

const orm = MikroORM.init({
  entities: [BaseEntity, ApiKey, Member],
  metadataProvider: TsMorphMetadataProvider,
  type: "postgresql", // or 'sqlite' or 'postgresql' or 'mariadb'
  clientUrl: process.env.DATABASE_URL,
  pool: {
    max: 10,
  },
  discovery: {
    disableDynamicFileAccess: true,
    requireEntitiesArray: true,
    alwaysAnalyseProperties: true,
  },
  driverOptions: {
    connection: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  migrations: {
    tableName: "mikro_orm_migrations",
    path: "./migrations",
    pattern: /^[\w-]+\d+\.[tj]s$/,
    // transactionals: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: "js", // migration generation mode
  },
  findOneOrFailHandler: (
    _entityName: string,
    _where: Dictionary | IPrimaryKey
  ) => {
    throw new SrkError("resourceInvalid");
  },
  debug: process.env.NODE_ENV !== "production" ? ["query-params"] : false,
  validate: true,
  strict: true,
});

export default orm;
export { storage };
