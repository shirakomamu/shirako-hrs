import ISrkResponse from "@@/common/interfaces/api";
import { GetterTree, MutationTree, ActionTree } from "vuex";

interface User {
  username?: string;
  displayName?: string;
  discriminator?: number;
  email?: string | null;
  rgs?: string[];
}

export const state = () => ({
  jwtState: undefined as "valid" | undefined,
  tokenState: undefined as "valid" | undefined,
  token: undefined as string | undefined,
  user: undefined as User | undefined,
});

export type ModuleState = ReturnType<typeof state>;

export const getters: GetterTree<ModuleState, ModuleState> = {
  jwtState: (state) => state.jwtState,
  tokenState: (state) => state.tokenState,
  token: (state) => state.token,
  user: (state) => state.user,
};

export const mutations: MutationTree<ModuleState> = {
  setJwtState: (state, jwtState?: boolean) =>
    (state.jwtState = jwtState ? "valid" : undefined),
  setTokenState: (state, tokenState?: boolean) =>
    (state.tokenState = tokenState ? "valid" : undefined),
  setToken: (state, token?: string) => (state.token = token),
  setUser: (state, user?: User) => (state.user = user),
};

export const actions: ActionTree<ModuleState, ModuleState> = {
  async checkVersion({ commit, dispatch, getters }) {
    if (getters.tokenState !== "valid") {
      return;
    }

    const response: ISrkResponse = await dispatch(
      "api/send",
      {
        method: "post",
        url: "/api/auth/login",
        data: {
          token: getters.token,
        },
      },
      { root: true }
    );

    if (response.ok) {
      commit("setJwtState", true);
      commit("setTokenState", true);
      commit("setUser", response.payload);
    } else {
      commit("setJwtState");
      commit("setTokenState");
      commit("setToken");
      commit("setUser");
    }
  },
};
