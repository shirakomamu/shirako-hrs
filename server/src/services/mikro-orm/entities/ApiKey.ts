import { EntitySchema } from "@mikro-orm/core";
import { IBaseEntity } from "./BaseEntity";
import { IMember } from "./Member";

export interface IApiKey extends IBaseEntity {
  key: string;
  useCount: number;
  member: IMember;
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
