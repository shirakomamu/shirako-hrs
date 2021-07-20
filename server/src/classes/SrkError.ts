import configuration from "server/config/srkError";
import { SrkErrorInstance } from "server/services/srk-error";

export default class SrkError<T = any> implements SrkErrorInstance {
  public name: string;
  public status: number;
  public message?: string;
  public data?: T;

  constructor(id: keyof typeof configuration, data?: T) {
    const error = configuration[id] || configuration.internalError;

    this.name = error.name;
    this.status = error.status;
    this.message = error.message;
    this.data = data;
  }
}
