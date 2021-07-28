import { GetterTree, MutationTree, ActionTree } from "vuex";
import { ActorDto } from "common/dto/auth";
import { ISrkResponse, ISelfIdentifyPayload } from "common/types/api";

export const state = () => ({
  actor: null as ActorDto | null,
  loaded: false as boolean,
});

export interface ModuleState extends ReturnType<typeof state> {}

export const getters: GetterTree<ModuleState, ModuleState> = {
  actor: (state) => state.actor,
  loaded: (state) => state.loaded,
};

export const mutations: MutationTree<ModuleState> = {
  setActor: (state, actor?: ActorDto) => {
    state.actor = actor || null;
    state.loaded = true;
  },
};

export const actions: ActionTree<ModuleState, ModuleState> = {
  async fetch({
    dispatch,
    commit,
  }): Promise<ISrkResponse<ISelfIdentifyPayload>> {
    const response: ISrkResponse<ISelfIdentifyPayload> = await dispatch(
      "api/send",
      {
        method: "get",
        url: "/api/auth/me",
      },
      { root: true }
    );

    if (response.ok) {
      commit("setActor", response.payload.actor);
    } else {
      commit("setActor");
    }

    return response;
  },
};
