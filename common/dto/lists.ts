import { ListVisibility } from "common/enums";

export type CreateListDto = {
  name: string;
  description: string | null;
  visibility: ListVisibility;
};

export type EditListDto = {
  name?: string;
  description?: string | null;
  visibility?: ListVisibility;
};

export type GetListDto = {
  username: string;
  id: string;
};

export type AddItemToListDto = {
  username: string;
  id: string;
  destinationId: string;
};

export type RemoveItemFromListDto = AddItemToListDto;
