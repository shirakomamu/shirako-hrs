import { SrkErrorInstance } from "server/services/srk-error";

const config = {
  internalError: {
    name: "internal_error",
    status: 500,
    message: "An internal server error has occurred. Try again later.",
  },
  syntaxError: {
    name: "syntax_error",
    status: 400,
    message: "Request syntax is malformed.",
  },
  badRequest: {
    name: "bad_request",
    status: 400,
    message: "The request data was rejected.",
  },
  badRoute: {
    name: "bad_route",
    status: 404,
    message: "This path was not found.",
  },
  badMethod: {
    name: "bad_method",
    status: 405,
    message: "This method is not supported at this path.",
  },
  jwtInvalid: {
    name: "client_auth_invalid",
    status: 401,
    message: "Client authentication data is invalid.",
  },
  jwtExpired: {
    name: "client_auth_expired",
    status: 401,
    message: "Client authentication data has expired.",
  },
  unauthorized: {
    name: "user_unauthorized",
    status: 403,
    message: "You are not authorized to perform that action.",
  },
  resourceInvalid: {
    name: "resource_invalid",
    status: 404,
    message: "This resource was not found.",
  },
  resourceExists: {
    name: "resource_exists",
    status: 409,
    message: "This resource already exists.",
  },
  apiKeyInvalid: {
    name: "api_key_invalid",
    status: 401,
    message: "API key is invalid.",
  },
  rateLimited: {
    name: "too_many_requests",
    status: 429,
    message: "Too many requests have been performed. Try again later.",
  },
  notAllowed: {
    name: "not_allowed",
    status: 400,
    message: "Data was rejected. Try again with different data.",
  },
};

export default config as { [k in keyof typeof config]: SrkErrorInstance };
