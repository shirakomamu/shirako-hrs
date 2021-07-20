import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import { BusinessIdentifyDto } from "common/dto/items";
import { ISrkResponse } from "common/types/api";
import { IDestinationItemPayload } from "common/types/api/items";
import DestinationListModel from "./DestinationList.model";
import DestinationListItemModel from "./DestinationListItem.model";
import VgtParamModel from "./VgtParam.model";

interface Meta {
  fetching?: boolean;
}

export default class extends Model {
  static entity = "destinationItem";
  static primaryKey = "id";

  public id!: string;
  public name!: string;
  public url!: string;
  public price!: string;
  public rating!: number;
  public review_count!: number;
  public timezone!: string;
  public display_address!: string[];
  public display_phone!: string;
  public lastUpdated!: number;
  public hours!: {
    is_open_now: boolean;
    hours_type: string;
    open: {
      is_overnight: boolean;
      start: string; // 0000
      end: string; // 0000
      day: number; // 0-6 (Mon - Sun)
    }[];
  }[];

  public special_hours!: {
    date: string; // yyyy-MM-dd
    is_closed: boolean;
    is_overnight: boolean;
    start: string; // 0000
    end: string; // 0000
  }[];

  public lists!: DestinationListModel[];

  private detailsLoaded!: boolean;

  public static fields() {
    return {
      id: this.string(null),
      name: this.string(null),
      url: this.string(null),
      price: this.string(null),
      rating: this.number(null),
      review_count: this.number(null),
      display_address: this.attr([]),
      display_phone: this.string(null),
      lastUpdated: this.number(null),
      timezone: this.string(null).nullable(),
      hours: this.attr([]),
      special_hours: this.attr([]),
      lists: this.belongsToMany(
        DestinationListModel,
        DestinationListItemModel,
        "itemId",
        "listId"
      ),
      detailsLoaded: this.boolean(false),
    };
  }

  private static getMeta(): Meta {
    return this.store().getters["orm/getByEntity"](this.entity);
  }

  private static setMeta(data: Meta) {
    return this.store().commit("orm/setByEntity", { key: this.entity, data });
  }

  public static set fetching(isFetching: boolean) {
    this.setMeta({
      fetching: isFetching,
    });
  }

  public static get fetching(): boolean {
    return this.getMeta().fetching || false;
  }

  public static async apiFetch(data: BusinessIdentifyDto) {
    const storedData = this.query().with("items").find(data.id);

    if (!storedData || !storedData.detailsLoaded) {
      this.fetching = true;
      const response: ISrkResponse<IDestinationItemPayload> =
        await this.store().dispatch("api/send", {
          method: "get",
          url: "/api/items/identify/" + data.id,
        } as AxiosRequestConfig);
      this.fetching = false;

      if (response.ok) {
        this.insertOrUpdate({
          data: {
            ...response.payload,
            detailsLoaded: true,
          },
        });

        return response.payload;
      }

      return null;
    } else {
      return storedData.$toJson() as IDestinationItemPayload;
    }
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
