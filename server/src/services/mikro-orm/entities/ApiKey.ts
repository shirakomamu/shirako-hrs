import { EntitySchema } from "@mikro-orm/core";
import { IBaseEntity } from "./BaseEntity";
import { IMember } from "./Member";

export class IApiKey extends IBaseEntity {
  key: string;
  useCount: number;
  member: IMember;

  constructor(key: string, member: IMember) {
    super();
    this.key = key;
    this.useCount = 0;
    this.member = member;
  }
}

export default new EntitySchema<IApiKey, IBaseEntity>({
  name: "ApiKey",
  extends: "BaseEntity",
  properties: {
    key: { type: "string", unique: true },
    useCount: { type: "number", default: 0 },
    member: { entity: "Member", reference: "m:1" },
  },
});
