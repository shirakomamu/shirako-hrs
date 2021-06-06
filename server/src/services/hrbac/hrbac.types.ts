import { Role, RoleGroup } from "./hrbac.enums";

export type HrbacOptions = {
  [key in keyof RoleGroup as string]: {
    name: string;
    description?: string;
    roles: Role[];
    inherits?: RoleGroup[];
  };
};
