import { ListVisibility } from "common/enums";

export type CreateListDto = {
  name: string;
  description: string | null;
  visibility: ListVisibility;
};

export type GetListDto = {
  username: string;
  id: string;
};
