import { BigIntType, EntitySchema } from "@mikro-orm/core";
import snowflake from "src/services/snowflake";

export class BaseEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export default new EntitySchema<BaseEntity>({
  class: BaseEntity,
  abstract: true,
  properties: {
    id: {
      type: BigIntType,
      primary: true,
      onCreate: () => snowflake.generate(),
    },
    createdAt: { type: Date, onCreate: () => new Date(), nullable: true },
    updatedAt: {
      type: Date,
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
