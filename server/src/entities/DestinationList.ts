import { ListVisibility } from "@@/common/enums";
import { Collection, EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Destination } from "./Destination";
import { Member } from "./Member";

export class DestinationList extends BaseEntity {
  owner: Member;
  name: string;
  description: string | null;
  visibility: ListVisibility;
  sharedWith = new Collection<Member>(this);
  destinations = new Collection<Destination>(this);

  constructor(
    owner: Member,
    name: string,
    description: string | null,
    visibility: ListVisibility
  ) {
    super();
    this.owner = owner;
    this.name = name;
    this.description = description;
    this.visibility = visibility;
  }
}

export default new EntitySchema<DestinationList, BaseEntity>({
  class: DestinationList,
  properties: {
    owner: { entity: () => Member, reference: "m:1" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    visibility: { enum: true, items: () => ListVisibility },
    sharedWith: { entity: () => Member, reference: "m:n" },
    destinations: { entity: () => Destination, reference: "m:n" },
  },
});
