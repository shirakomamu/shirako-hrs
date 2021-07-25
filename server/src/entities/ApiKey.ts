import { EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Member } from "./Member";

export class ApiKey extends BaseEntity {
  owner: Member;
  key: string;

  constructor(owner: Member, key: string) {
    super();
    this.owner = owner;
    this.key = key;
  }
}

export default new EntitySchema<ApiKey, BaseEntity>({
  class: ApiKey,
  properties: {
    owner: { entity: () => Member, mappedBy: "apiKey", reference: "1:1" },
    key: { type: "string" },
  },
});
