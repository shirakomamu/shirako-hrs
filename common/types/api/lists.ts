import { ListVisibility } from "common/enums";
import { IDestinationItemPayload } from "./items";

export interface DestinationListMetadata {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  visibility: ListVisibility;
}

export interface IDestinationListPayload extends DestinationListMetadata {
  items: IDestinationItemPayload[];
}

export interface IDestinationListsPayload {
  lists: DestinationListMetadata[];
}
