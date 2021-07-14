import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import { CreateListDto, GetListDto } from "common/dto/lists";
import { ListVisibility } from "common/enums";
import { IDestinationListPayload, ISrkResponse } from "common/types/api";
import DestinationItemModel from "./DestinationItem.model";
import VgtParamModel from "./VgtParam.model";

export default class extends Model {
  static entity = "destinationList";
  static primaryKey = ["owner", "id"];

  public id!: string;
  public name!: string;
  public owner!: string;
  public description!: string | null;
  public visibility!: ListVisibility;
  public items!: DestinationItemModel[];

  public static state() {
    return {
      fetching: false,
    };
  }

  public static fields() {
    return {
      id: this.string(null),
      name: this.string(null),
      owner: this.string(null),
      description: this.string(null).nullable(),
      visibility: this.string(null),
      items: this.hasMany(DestinationItemModel, "id"),
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

  public static async apiCreateList(username: string, data: CreateListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "post",
        url: "/api/lists/" + username,
        data,
      });

    if (response.ok) {
      this.insertOrUpdate({
        data: response.payload,
      });
    }

    return response;
  }

  public static async apiDeleteList(_data: GetListDto) {
    return await null;
  }

  public static async apiUpdateList(_data: string) {
    return await null;
  }

  public static async apiAddUserToList(_username: string) {
    return await null;
  }

  public static async apiRemoveUserFromList(_username: string) {
    return await null;
  }

  public static async apiFetch(data: GetListDto) {
    const storedData = this.query()
      .with("items")
      .find([data.username, data.id]);

    if (!storedData) {
      this.commit((state) => (state.fetching = true));
      const response: ISrkResponse<IDestinationListPayload> =
        await this.store().dispatch("api/send", {
          method: "get",
          url: "/api/lists/" + data.username + "/" + data.id,
        } as AxiosRequestConfig);
      this.commit((state) => (state.fetching = false));

      if (response.ok) {
        this.insertOrUpdate({
          data: response.payload,
        });

        return response.payload;
      }

      return null;
    } else {
      return storedData.$toJson() as IDestinationListPayload;
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
