import { EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Member } from "./Member";

export class ApiKey extends BaseEntity {
  key: string;
  useCount: number;
  member: Member;

  constructor(key: string, member: Member) {
    super();
    this.key = key;
    this.useCount = 0;
    this.member = member;
  }
}

export default new EntitySchema<ApiKey, BaseEntity>({
  class: ApiKey,
  properties: {
    key: { type: String, unique: true },
    useCount: { type: Number, default: 0 },
    member: { entity: () => Member, reference: "m:1" },
  },
});
