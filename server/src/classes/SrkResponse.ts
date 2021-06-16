import SrkError from "./SrkError";

export default class SrkResponse<T = any> {
  public ok: boolean;
  public error?: SrkError | null;
  public payload?: T;
  public status: number;
  public headers?: {
    [key: string]: string;
  };

  constructor({
    status,
    headers,
    error,
    payload,
  }: {
    status?: number;
    headers?: { [key: string]: string };
    error?: SrkError | null;
    payload?: T;
  } = {}) {
    this.ok = !error;
    this.error = error;
    this.payload = payload;
    this.status = status || (!error ? 200 : error.status);
    this.headers = headers;
  }
}
