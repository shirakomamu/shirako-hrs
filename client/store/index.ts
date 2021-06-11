import { Request, Response } from "express";
import { GetterTree, ActionTree, MutationTree } from "vuex";

export const state = () => ({});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {};

export const actions: ActionTree<RootState, RootState> = {
  // executed on server before browser loads
  nuxtServerInit(
    _context,
    { _req, _res }: { _req: Request; _res: Response }
  ) {},
};
