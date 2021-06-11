import configuration from "src/config/srk-error";
import { SrkErrorInstance } from "src/services/srk-error";

export default class SrkError implements SrkErrorInstance {
  public name: string;
  public status: number;
  public message?: string;
  public data?: any;

  constructor(id: keyof typeof configuration, data?: any) {
    const error = configuration[id] || configuration.internalError;

    this.name = error.name;
    this.status = error.status;
    this.message = error.message;
    this.data = data;
  }
}
