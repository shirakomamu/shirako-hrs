import { EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Member } from "./Member";

// if user requests friend, insert 1,2
// if friend accepts, insert 2,1
// if either one deletes, delete both
export class Friend extends BaseEntity {
  user: Member;
  friend: Member;

  constructor(user: Member, friend: Member) {
    super();
    this.user = user;
    this.friend = friend;
  }
}

export default new EntitySchema<Friend, BaseEntity>({
  class: Friend,
  properties: {
    user: { entity: () => Member, reference: "m:1", onDelete: "cascade" },
    friend: { entity: () => Member, reference: "m:1", onDelete: "cascade" },
  },
  uniques: [
    {
      properties: ["user", "friend"],
      name: "userFriend",
    },
  ],
});
