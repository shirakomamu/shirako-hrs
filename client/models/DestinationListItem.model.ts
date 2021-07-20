import { Model } from "@vuex-orm/core";

export default class extends Model {
  static entity = "destinationListItem";
  static primaryKey = ["listId", "itemId"];

  public listId!: string;
  public itemId!: string;

  public static fields() {
    return {
      listId: this.string(null),
      itemId: this.string(null),
    };
  }
}
