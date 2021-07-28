import { Model } from "@vuex-orm/core";

export default class extends Model {
  static entity = "destinationListMember";
  static primaryKey = ["listId", "username"];

  public listId!: string;
  public username!: string;

  public static fields() {
    return {
      listId: this.string(null),
      username: this.string(null),
    };
  }
}
