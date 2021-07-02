import { EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

export class Destination extends BaseEntity {
  yelpId: string;

  constructor(yelpId: string) {
    super();
    this.yelpId = yelpId;
  }
}

export default new EntitySchema<Destination, BaseEntity>({
  class: Destination,
  properties: {
    yelpId: { type: "string", unique: true },
  },
});
