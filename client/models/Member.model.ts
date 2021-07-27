import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import { IMemberPayload, ISrkResponse } from "common/types/api";
import DestinationListModel from "./DestinationList.model";
import FriendModel from "./Friend.model";
import VgtParamModel from "./VgtParam.model";

interface Meta {
  fetching?: boolean;
}

export default class extends Model {
  static entity = "user";
  static primaryKey = "username";

  public username!: string;
  public nickname!: string;
  public avatar!: string;
  // public pendingFriendRequestFrom!: boolean;
  // public pendingFriendRequestTo!: boolean;
  // public isFriend!: boolean;
  public friendStatus!: FriendModel;
  public isAcceptingFriends!: boolean;
  public lists!: DestinationListModel[];

  public static fields() {
    return {
      username: this.string(null),
      nickname: this.string(null),
      avatar: this.string(null),
      // pendingFriendRequestFrom: this.boolean(false),
      // pendingFriendRequestTo: this.boolean(false),
      // isFriend: this.boolean(false),
      friendStatus: this.hasOne(FriendModel, "username"),
      isAcceptingFriends: this.boolean(false),
      lists: this.hasMany(DestinationListModel, "owner"),
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

  public static async apiFetch(username: string) {
    const storedData = this.query()
      .with("lists")
      .with("friendStatus")
      .find(username.toLowerCase());

    if (!storedData) {
      this.fetching = true;
      const response: ISrkResponse<IMemberPayload> =
        await this.store().dispatch("api/send", {
          method: "get",
          url: "/api/users/" + username,
        } as AxiosRequestConfig);
      this.fetching = false;

      if (response.ok) {
        this.insertOrUpdate({
          data: response.payload,
        });

        return this.query()
          .with("lists")
          .with("friendStatus")
          .find(username.toLowerCase());
      }

      return null;
    } else {
      return storedData;
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
