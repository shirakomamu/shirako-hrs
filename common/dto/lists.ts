import { ListVisibility } from "common/enums";

export type CreateListDto = {
  name: string;
  description: string | null;
  visibility: ListVisibility;
};

export type GetListsDto = {
  username: string;
};

export type GetListDto = {
  username: string;
  id: string;
};
