import { NuxtConfig } from "@nuxt/types";
import { gitDescribeSync } from "git-describe";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import appinfo from "./appinfo";

const serverConfig = {
  host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
  port: process.env.PORT || 3000,
};

export default {
  srcDir: "client/",

  target: "server",
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: appinfo.name,
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: appinfo.description,
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: appinfo.favicon,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/styles/index.less"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "./plugins/axios" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    // https://go.nuxtjs.dev/pwa
    // "@nuxtjs/pwa",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@/modules/api",
    [
      "@dansmaculotte/nuxt-security",
      {
        dev: false,
        hsts: {
          maxAge: 63072000,
          includeSubDomains: true,
          preload: true,
        },
        csp: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // inline required by vue2
            objectSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // inline required by vue2
            // fontSrc: ["'self'"],
            // imgSrc: ["'self'"],
          },
          reportOnly: false,
        },
        referrer: "same-origin",
        additionalHeaders: true, // x-frame-options, x-xss-protection, x-content-type-options
      },
    ],
    [
      "nuxt-vuex-localstorage",
      {
        localStorage: ["auth/token"], // If not entered, “localStorage” is the default value
        sessionStorage: [], // If not entered, “sessionStorage” is the default value
        keyMixTimes: 64, // number of repetitions of the hash function. Default is set to 64
        KeyLength: 64, // length of the digest. Default is set to 64.
      },
    ],
  ],

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL || "/",
    },
    appinfo,
    build: gitDescribeSync().hash,
    fcSitekey: appinfo.fcSitekey,
  },

  privateRuntimeConfig: {
    axios: {
      baseURL:
        process.env.BASE_URL ||
        "http://" + serverConfig.host + ":" + serverConfig.port,
    },
  },

  server: {
    host: serverConfig.host,
    port: serverConfig.port,
    timing: false,
  },

  // serverMiddleware: [
  //   {
  //     path: "/api",
  //     handler: await nest(), // use nest app instance as a normal nuxt server middleware
  //   },
  // ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  // pwa: {
  //   manifest: {
  //     lang: "en",
  //   },
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      // config.externals = {
      //   knex: "commonjs knex",
      //   "mikro-orm": "commonjs mikro-orm",
      // };
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.plugins) {
        config.resolve.plugins = [];
      }

      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: "./tsconfig.json",
        })
      );
    },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: "http://" + serverConfig.host + ":" + serverConfig.port,
  },

  // TailwindCSS module configuration (https://tailwindcss.nuxtjs.org/options)
  tailwindcss: {
    cssPath: "@/assets/styles/tailwind.less",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    viewer: false,
    config: {},
  },

  ignore: ["**/*.test.*", ["./migrations/*.*"]],
} as NuxtConfig;
