import { EntitySchema } from "@mikro-orm/core";

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export default new EntitySchema<BaseEntity>({
  name: "BaseEntity",
  abstract: true,
  properties: {
    id: { type: "number", primary: true },
    createdAt: { type: "date", onCreate: () => new Date(), nullable: true },
    updatedAt: {
      type: "date",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
