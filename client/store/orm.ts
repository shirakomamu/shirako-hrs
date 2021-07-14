import { GetterTree, MutationTree } from "vuex";

export const state = () => ({});

export type ModuleState = ReturnType<typeof state>;

export const getters: GetterTree<ModuleState, ModuleState> = {
  getByEntity: (state) => (key: keyof ModuleState) => state[key] || {},
};

export const mutations: MutationTree<ModuleState> = {
  setByEntity: (
    state,
    { key, data }: { key: keyof ModuleState; data: any }
  ) => {
    state[key] = Object.assign(state[key] || {}, data);
  },
};
