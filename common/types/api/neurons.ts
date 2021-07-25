import { IDestinationItemPayload } from "./items";

export interface NeuronData extends IDestinationItemPayload {
  lists: string[];
  users: string[];
}

export interface IActivatedNeuronsPayload {
  neurons: NeuronData[];
  totalNeurons: number;
}
