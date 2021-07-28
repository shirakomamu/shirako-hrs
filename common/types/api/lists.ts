import { ListVisibility } from "common/enums";
import { IDestinationItemPayload } from "./items";
import { UserIdentity } from "./users";

export interface DestinationListMetadata {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  visibility: ListVisibility;
}

export interface IDestinationListPayload extends DestinationListMetadata {
  items: IDestinationItemPayload[];
  users: Omit<UserIdentity, "id">[];
}

export interface IDestinationListsPayload {
  lists: DestinationListMetadata[];
}
