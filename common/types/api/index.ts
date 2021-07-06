type OkResponse<T = any> = {
  ok: true;
  payload: T;
};

type ErrorResponse = {
  ok: false;
  error: {
    name: string;
    message?: string;
    data?: any;
  };
};

type ISrkResponse<T = any> = OkResponse<T> | ErrorResponse;

export default ISrkResponse;
export * from "./payloads";