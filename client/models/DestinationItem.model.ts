import { Model } from "@vuex-orm/core";
import VgtParamModel from "./VgtParam.model";

export default class extends Model {
  static entity = "destinationItem";
  static primaryKey = "id";

  public id!: string;
  // public name!: string;
  // public url!: string;
  // public price!: string;

  public static state() {
    return {
      fetching: false,
    };
  }

  public static fields() {
    return {
      id: this.string(null),
      // name: this.string(null),
      // url: this.string(null),
      // price: this.string(null),
    };
  }

  private static getMeta() {
    return this.store().getters["orm/getByEntity"](this.entity);
  }

  private static setMeta(data: {
    visibleKeys?: string[];
    numRecords?: number;
  }) {
    return this.store().commit("orm/setByEntity", { key: this.entity, data });
  }

  private static initialize() {
    this.database().model(VgtParamModel).updateParams({
      id: this.entity,
      // sort: [],
      // page: 1,
      // perPage: 25,
      // perPageOptions: [10, 25, 50],
      // searchTerm: null,
    });
  }
}
