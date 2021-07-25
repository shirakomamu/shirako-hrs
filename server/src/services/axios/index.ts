import axios from "axios";
import { MAX_REQUESTS_COUNT } from "server/config/axios";

const instance = axios.create({
  timeout: 60000,
});

let PENDING_REQUESTS = 0;

instance.interceptors.request.use((config) => {
  return new Promise((resolve) => {
    // immediately try to resolve
    if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
      PENDING_REQUESTS++;
      return resolve(config);
    }

    const interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++;
        clearInterval(interval);
        resolve(config);
      }
    });
  });
});

instance.interceptors.response.use(
  (response) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response);
  },
  (error) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error);
  }
);

export default instance;
