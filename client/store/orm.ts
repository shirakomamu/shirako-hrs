import { GetterTree, MutationTree } from "vuex";

export const state = () => ({
  container: {} as { [key: string]: any },
});

export interface ModuleState extends ReturnType<typeof state> {}

export const getters: GetterTree<ModuleState, ModuleState> = {
  getByEntity: (state) => (key: keyof ModuleState) => {
    return state.container[key] || {};
  },
};

export const mutations: MutationTree<ModuleState> = {
  setByEntity: (
    state,
    { key, data }: { key: keyof ModuleState; data: any }
  ) => {
    const { [key]: keyValue } = state.container;
    const newState = {
      ...keyValue,
      ...data,
    };
    state.container = Object.assign({}, state.container, { [key]: newState });
  },
};
