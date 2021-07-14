import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import { IMemberPayload, ISrkResponse } from "common/types/api";
import DestinationListModel from "./DestinationList.model";
import VgtParamModel from "./VgtParam.model";

export default class extends Model {
  static entity = "user";
  static primaryKey = "username";

  public username!: string;
  public nickname!: string;
  public avatar!: string;
  public hasFriendRequest!: boolean;
  public isFriend!: boolean;
  public isAcceptingFriends!: boolean;
  public lists!: DestinationListModel[];

  public static state() {
    return {
      fetching: false,
    };
  }

  public static fields() {
    return {
      username: this.string(null),
      nickname: this.string(null),
      avatar: this.string(null),
      hasFriendRequest: this.boolean(false),
      isFriend: this.boolean(false),
      isAcceptingFriends: this.boolean(false),
      lists: this.hasMany(DestinationListModel, "owner"),
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

  public static async apiSendFriendRequest(_username: string) {
    return await null;
  }

  public static async apiConfirmFriendRequest(_username: string) {
    return await null;
  }

  public static async apiDeclineFriendRequest(_username: string) {
    return await null;
  }

  public static async apiFetch(username: string) {
    const storedData = this.query().with("lists").find(username);

    if (!storedData) {
      this.commit((state) => (state.fetching = true));
      const response: ISrkResponse<IMemberPayload> =
        await this.store().dispatch("api/send", {
          method: "get",
          url: "/api/users/" + username,
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
      return storedData.$toJson() as IMemberPayload;
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
