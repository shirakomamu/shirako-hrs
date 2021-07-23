import { IDestinationItemPayload } from "./items";

export interface NeuronData extends IDestinationItemPayload {}

export interface IActivatedNeuronsPayload {
  neurons: NeuronData[];
}
