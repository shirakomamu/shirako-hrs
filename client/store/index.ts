import { Request, Response } from "express";
import { GetterTree, ActionTree, MutationTree } from "vuex";

export const state = () => ({});

export interface RootState extends ReturnType<typeof state> {}

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {};

export const actions: ActionTree<RootState, RootState> = {
  // executed on server before browser loads
  // this looks for a cookie and loads it so that user is presumed authenticated as before
  async nuxtServerInit(
    { commit: _commit, dispatch },
    { req: _req, res: _res }: { req: Request; res: Response }
  ) {
    // const cookies = req.headers.cookie;

    // if (!cookies) {
    //   console.log("Exit 1");
    //   await dispatch("auth/fetch");
    //   return;
    // }

    // const cookieResult = cookie.parse(cookies);
    // const savedStoreString = cookieResult["hrs-vuex"];
    // if (!savedStoreString) {
    //   console.log("Exit 2");
    //   await dispatch("auth/fetch");
    //   return;
    // }

    // let savedStore: { [key: string]: any } = {};
    // try {
    //   savedStore = JSON.parse(savedStoreString);
    // } catch (e) {
    //   console.log("Exit 3");
    //   await dispatch("auth/fetch");
    //   return;
    // }

    // if (!savedStore.auth?.actor) {
    //   console.log("Exit 4");
    //   await dispatch("auth/fetch");
    //   return;
    // }

    // console.log("Final");
    // commit("auth/setActor", savedStore.auth.actor);
    return await dispatch("auth/fetch");
  },
};
