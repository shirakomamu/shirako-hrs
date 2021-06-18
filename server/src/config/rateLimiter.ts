// base limiter
export const BASE_SUBPREFIX = "base";
export const BASE_POINTS = 5;
export const BASE_DURATION = 5;
export const BASE_BURST_SUBPREFIX = "base-burst";
export const BASE_BURST_POINTS = 15;
export const BASE_BURST_DURATION = 30;

// for attempts by IP
export const AUTH_SLOW_SUBPREFIX = "ip";
export const AUTH_SLOW_POINTS = 100; // 100 attempts
export const AUTH_SLOW_DURATION = 60 * 60 * 24; // 1 day
export const AUTH_SLOW_BLOCK_DURATION = 60 * 60 * 24; // block for 1 day

// for attempts by user and IP
export const AUTH_FAIL_SUBPREFIX = "ip/user";
export const AUTH_FAIL_POINTS = 10; // 10 attempts
export const AUTH_FAIL_DURATION = 60 * 60 * 24; // 1 day
export const AUTH_FAIL_BLOCK_DURATION = 60 * 60 * 24; // block for 1 day
