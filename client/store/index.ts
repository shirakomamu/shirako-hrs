// import FriendModel from "client/models/Friend.model";
// import { ISelfIdentifyPayload, ISrkResponse } from "common/types/api";
import TimeAgo from "javascript-time-ago";
import { Request, Response } from "express";
import { GetterTree, ActionTree, MutationTree } from "vuex";

export const state = () => ({
  selectedNeurons: [] as string[],
  timeAgoInstance: null as TimeAgo | null,
});

export interface RootState extends ReturnType<typeof state> {}

export const getters: GetterTree<RootState, RootState> = {
  selectedNeurons: (state) => state.selectedNeurons,
  timeAgo: (state) => state.timeAgoInstance,
};

export const mutations: MutationTree<RootState> = {
  addNeuron: (state, neuron: string) => state.selectedNeurons.push(neuron),
  removeNeuron: (state, neuron: string) => {
    state.selectedNeurons = state.selectedNeurons.filter((e) => e !== neuron);
  },
  setTimeAgo: (state, timeAgo: TimeAgo) => (state.timeAgoInstance = timeAgo),
};

export const actions: ActionTree<RootState, RootState> = {
  // executed on server before browser loads
  // this looks for a cookie and loads it so that user is presumed authenticated as before
  async nuxtServerInit(
    { commit: _commit, dispatch: _dispatch },
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
    // const r: ISrkResponse<ISelfIdentifyPayload> = await dispatch("auth/fetch");
    // if (r.ok && r.payload.actor?.id) {
    //   await this.$db().model(FriendModel).apiLoad();
    // }
  },
};
