import { AsyncLocalStorage } from "async_hooks";
import {
  MikroORM,
  EntityManager,
  IPrimaryKey,
  Dictionary,
} from "@mikro-orm/core";
import {
  RedisCacheAdapter,
  RedisCacheAdapterOptions,
} from "mikro-orm-cache-adapter-redis";
import SrkError from "server/classes/SrkError";
import createRedis from "server/services/redis";
import { MIKRO_ORM_PREFIX } from "server/config/redis";
import {
  BaseEntityEntitySchema,
  DestinationEntitySchema,
  DestinationListEntitySchema,
  FriendEntitySchema,
  MemberEntitySchema,
  ApiKeyEntitySchema,
} from "server/entities";

const storage = new AsyncLocalStorage<EntityManager>();

const orm = MikroORM.init({
  context: () => storage.getStore(),
  entities: [
    BaseEntityEntitySchema,
    MemberEntitySchema,
    FriendEntitySchema,
    DestinationEntitySchema,
    DestinationListEntitySchema,
    ApiKeyEntitySchema,
  ],
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
  resultCache: {
    adapter: RedisCacheAdapter,
    options: {
      client: createRedis({
        keyPrefix: MIKRO_ORM_PREFIX,
      }),
      debug: process.env.NODE_ENV !== "production",
    } as RedisCacheAdapterOptions,
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
    safe: true, // allow to disable table and column dropping
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
