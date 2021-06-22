import { Model } from "@vuex-orm/core";
import { AxiosResponse } from "axios";
import ISrkResponse from "@@/common/interfaces/api";

const ROUTE_CACHE_DURATION_SECONDS = 600;
const LOGIN_PATH = "/login";

interface RouteModel {
  path: string;
  result: boolean;
  updatedOn: number;
}

class RouteModel extends Model {
  static entity = "route";
  static primaryKey = "path";

  public static fields() {
    return {
      path: this.string(null),
      result: this.boolean(false),
      updatedOn: this.number(Date.now()),
    };
  }

  public static areAllRoutesMatched(routes: string[]): boolean {
    const all: (string | null)[] = this.all().map((e) => e.path);
    return routes.every((e) => all.includes(e));
  }

  public static canAccess(path: string): boolean {
    if (path === LOGIN_PATH) {
      return true;
    }
    const thisData = this.find(path);
    const now = Date.now();
    return (
      (thisData?.updatedOn || 0) + ROUTE_CACHE_DURATION_SECONDS * 1000 >= now
    );
  }

  public static async fetch(routes: string[]) {
    if (process.server) {
      return [];
    }

    const { data }: AxiosResponse<ISrkResponse<any>> =
      await this.store().dispatch("api/send", {
        method: "get",
        url: "/api/auth/check",
        data: routes,
      });

    if (data.ok) {
      data.payload.forEach((e: any) => {
        this.update({
          where: e.path,
          data: {
            result: e.result,
          },
        });
      });
    }

    return data;
  }
}

export default RouteModel;
