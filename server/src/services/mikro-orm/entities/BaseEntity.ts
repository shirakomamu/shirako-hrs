import { BigIntType, EntitySchema } from "@mikro-orm/core";
import snowflake from "src/services/snowflake";

export class IBaseEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export default new EntitySchema<IBaseEntity>({
  name: "BaseEntity",
  abstract: true,
  properties: {
    id: {
      type: BigIntType,
      primary: true,
      onCreate: () => snowflake.generate(),
    },
    createdAt: { type: "date", onCreate: () => new Date(), nullable: true },
    updatedAt: {
      type: "date",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
