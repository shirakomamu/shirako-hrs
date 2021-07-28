import { GetterTree, MutationTree, ActionTree } from "vuex";
import { ActorDto } from "common/dto/auth";
import { ISrkResponse, ISelfIdentifyPayload } from "common/types/api";

export const state = () => ({
  actor: null as ActorDto | null,
});

export interface ModuleState extends ReturnType<typeof state> {}

export const getters: GetterTree<ModuleState, ModuleState> = {
  actor: (state) => state.actor,
};

export const mutations: MutationTree<ModuleState> = {
  setActor: (state, actor?: ActorDto) => {
    state.actor = actor || null;
  },
};

export const actions: ActionTree<ModuleState, ModuleState> = {
  async fetch({
    dispatch,
    commit,
  }): Promise<ISrkResponse<ISelfIdentifyPayload>> {
    console.log("auth/fetch called");
    const response: ISrkResponse<ISelfIdentifyPayload> = await dispatch(
      "api/send",
      {
        method: "get",
        url: "/api/auth/me",
      },
      { root: true }
    );

    console.log("Response is", response);

    if (response.ok) {
      commit("setActor", response.payload.actor);
    } else {
      commit("setActor");
    }

    return response;
  },
};
