import { Request, Response } from "express";
import { GetterTree, ActionTree, MutationTree } from "vuex";
import cookie from "cookie";

export const state = () => ({});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {};

export const actions: ActionTree<RootState, RootState> = {
  // executed on server before browser loads
  // this looks for a cookie and loads it so that user is presumed authenticated as before
  async nuxtServerInit(
    { commit, dispatch },
    { req, res: _res }: { req: Request; res: Response }
  ) {
    const cookies = req.headers.cookie;

    if (!cookies) {
      await dispatch("auth/fetch");
      return;
    }

    const cookieResult = cookie.parse(cookies);
    const savedStoreString = cookieResult["hrs-vuex"];
    if (!savedStoreString) {
      await dispatch("auth/fetch");
      return;
    }

    let savedStore: { [key: string]: any } = {};
    try {
      savedStore = JSON.parse(savedStoreString);
    } catch (e) {
      await dispatch("auth/fetch");
      return;
    }

    if (!savedStore.auth?.actor) {
      await dispatch("auth/fetch");
      return;
    }

    commit("auth/setActor", savedStore.auth.actor);
  },
};
