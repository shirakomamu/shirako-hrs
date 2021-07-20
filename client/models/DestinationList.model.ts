import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import {
  AddItemToListDto,
  CreateListDto,
  EditListDto,
  GetListDto,
  RemoveItemFromListDto,
} from "common/dto/lists";
import { ListVisibility } from "common/enums";
import { IDestinationListPayload, ISrkResponse } from "common/types/api";
import DestinationItemModel from "./DestinationItem.model";
import DestinationListItemModel from "./DestinationListItem.model";
import VgtParamModel from "./VgtParam.model";

interface Meta {
  fetching?: boolean;
}

export default class extends Model {
  static entity = "destinationList";
  static primaryKey = ["owner", "id"];

  public id!: string;
  public name!: string;
  public owner!: string;
  public description!: string | null;
  public visibility!: ListVisibility;
  public items!: DestinationItemModel[];
  private itemsLoaded!: boolean;

  public static fields() {
    return {
      id: this.string(null),
      name: this.string(null),
      owner: this.string(null),
      description: this.string(null).nullable(),
      visibility: this.string(null),
      items: this.belongsToMany(
        DestinationItemModel,
        DestinationListItemModel,
        "listId",
        "itemId"
      ),
      itemsLoaded: this.boolean(false),
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

  public static async apiCreateList(username: string, data: CreateListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "post",
        url: "/api/lists/" + username,
        data,
      });

    if (response.ok) {
      const { items, ...rest } = response.payload;
      this.insertOrUpdate({
        data: {
          ...rest,
          items,
          itemsLoaded: true,
        },
      });
    }

    return response;
  }

  public static async apiDeleteList(params: GetListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "delete",
        url: "/api/lists/" + params.username + "/" + params.id,
      });

    if (response.ok) {
      await DestinationListItemModel.delete(
        (pivot) => pivot.listId === params.id
      );
      await this.delete([params.username, params.id]);
    }

    return response;
  }

  public static async apiUpdateList(params: GetListDto, data: EditListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "patch",
        url: "/api/lists/" + params.username + "/" + params.id,
        data,
      });

    if (response.ok) {
      this.insertOrUpdate({
        data: response.payload,
      });
    }

    return response;
  }

  public static async apiAddItemToList(params: AddItemToListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "post",
        url:
          "/api/lists/" +
          params.username +
          "/" +
          params.id +
          "/items/" +
          params.destinationId,
      });

    if (response.ok) {
      this.insertOrUpdate({
        data: {
          ...response.payload,
          itemsLoaded: true,
        },
      });
    }

    return response;
  }

  public static async apiRemoveItemFromList(params: RemoveItemFromListDto) {
    const response: ISrkResponse<IDestinationListPayload> =
      await this.store().dispatch("api/send", {
        method: "delete",
        url:
          "/api/lists/" +
          params.username +
          "/" +
          params.id +
          "/items/" +
          params.destinationId,
      });

    if (response.ok) {
      // https://github.com/vuex-orm/vuex-orm/issues/122
      // relations aren't automatically deleted
      await DestinationListItemModel.delete(
        (pivot) =>
          pivot.listId === params.id && pivot.itemId === params.destinationId
      );
      this.update({
        where: (list) =>
          list.owner === params.username && list.id === params.id,
        data: {
          ...response.payload,
          itemsLoaded: true,
        },
      });
    }

    return response;
  }

  public static async apiAddUserToList(_username: string) {
    return await null;
    // POST to /api/lists/:username/:id/members/:shareToUsername
  }

  public static async apiRemoveUserFromList(_username: string) {
    return await null;
    // DELETE to /api/lists/:username/:id/members/:shareToUsername
  }

  public static async apiFetch(params: GetListDto) {
    const storedData = this.query()
      .with("items")
      .find([params.username, params.id]);

    if (!storedData || !storedData.itemsLoaded) {
      this.fetching = true;
      const response: ISrkResponse<IDestinationListPayload> =
        await this.store().dispatch("api/send", {
          method: "get",
          url: "/api/lists/" + params.username + "/" + params.id,
        } as AxiosRequestConfig);
      this.fetching = false;

      if (response.ok) {
        this.insertOrUpdate({
          data: {
            ...response.payload,
            itemsLoaded: true,
          },
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