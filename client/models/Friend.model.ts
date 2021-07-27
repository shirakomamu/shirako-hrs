import { Model } from "@vuex-orm/core";
import { AxiosRequestConfig } from "axios";
import { FriendStatus } from "common/enums";
import { IFriendStatusPayload, ISrkResponse } from "common/types/api";
import MemberModel from "./Member.model";
import VgtParamModel from "./VgtParam.model";

interface Meta {
  fetching?: boolean;
}

export default class extends Model {
  static entity = "friend";
  static primaryKey = "username";

  public username!: string;
  public status!: FriendStatus;
  public member!: MemberModel;

  public static fields() {
    return {
      username: this.string(null),
      status: this.string(null),
      member: this.belongsTo(MemberModel, "username"),
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

  private static transformPayload(payload: IFriendStatusPayload) {
    this.create({
      data: payload.users.map((e) => ({
        username: e.user.username,
        status: e.status,
      })),
    });

    // this endpoint also returns their profiles, so update the member model
    this.store()
      .$db()
      .model(MemberModel)
      .insertOrUpdate({
        data: payload.users.map((e) => e.user),
      });
  }

  public static async apiLoad() {
    this.fetching = true;
    const response: ISrkResponse<IFriendStatusPayload> =
      await this.store().dispatch("api/send", {
        method: "get",
        url: "/api/users/me/friends",
      } as AxiosRequestConfig);
    this.fetching = false;

    if (response.ok) {
      this.transformPayload(response.payload);
    }
    return this.query().with("member").all();
  }

  public static async apiCreateFriend(username: string) {
    this.fetching = true;
    const response: ISrkResponse<IFriendStatusPayload> =
      await this.store().dispatch("api/send", {
        method: "post",
        url: "/api/users/me/friends",
        data: {
          username,
        },
      } as AxiosRequestConfig);
    this.fetching = false;

    if (response.ok) {
      this.transformPayload(response.payload);
    }
    return this.query().with("member").all();
  }

  public static async apiDeleteFriend(username: string) {
    this.fetching = true;
    const response: ISrkResponse<IFriendStatusPayload> =
      await this.store().dispatch("api/send", {
        method: "delete",
        url: "/api/users/me/friends",
        data: {
          username,
        },
      } as AxiosRequestConfig);
    this.fetching = false;

    if (response.ok) {
      this.transformPayload(response.payload);
    }
    return this.query().with("member").all();
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
