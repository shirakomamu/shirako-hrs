import assert from "common/utils/assert";
import { ChangeSetType, EntitySchema, FlushEventArgs } from "@mikro-orm/core";
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

  async deleteReversePair(e: FlushEventArgs) {
    const changeSets = e.uow.getChangeSets();
    const cs = changeSets.filter(
      (cs) => cs.type === ChangeSetType.DELETE && cs.entity instanceof Friend
    );

    if (!cs.length) return;

    const repo = e.em.getRepository(Friend);

    const entitiesToDelete = (
      await Promise.all(
        cs.map((f) => {
          const thisEntity = f.entity as this;
          const originatingUser = thisEntity.user;
          const targetUser = thisEntity.friend;

          return repo.findOne({
            user: targetUser,
            friend: originatingUser,
          });
        })
      )
    ).filter((f) => f);

    assert<Friend[]>(entitiesToDelete);

    if (!entitiesToDelete.length) return;

    entitiesToDelete.forEach((f) => repo.remove(f));
  }
}

export default new EntitySchema<Friend, BaseEntity>({
  class: Friend,
  properties: {
    user: { entity: () => Member, reference: "m:1" },
    friend: { entity: () => Member, reference: "m:1" },
  },
  uniques: [
    {
      properties: ["user", "friend"],
      name: "userFriend",
    },
  ],
  hooks: {
    beforeFlush: ["deleteReversePair"],
  },
});
