import { ListVisibility } from "common/enums";

export type CreateListDto = {
  name: string;
  description: string | null;
  visibility: ListVisibility;
};
