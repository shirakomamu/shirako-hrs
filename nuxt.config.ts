import { NuxtConfig } from "@nuxt/types";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import appinfo from "./appinfo";
// windi doesn't seem to play nice with non-root srcDir
import windiConfig from "./client/windi.config";

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
  css: ["assets/styles/index.less"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "./plugins/axios" },
    { src: "./plugins/vuex-orm" },
    { src: "./plugins/mitt" },
    // { src: "./plugins/vuex-persist", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    "@nuxtjs/composition-api/module",
    // https://go.nuxtjs.dev/tailwindcss
    "nuxt-windicss",
    // https://go.nuxtjs.dev/pwa
    // "@nuxtjs/pwa",
    // "@aceforth/nuxt-optimized-images",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "modules/api",
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
            imgSrc: ["'self'", "data:", "*.yelpcdn.com"],
          },
          reportOnly: false,
        },
        referrer: "same-origin",
        additionalHeaders: true, // x-frame-options, x-xss-protection, x-content-type-options
      },
    ],
  ],

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL || "/",
    },
    appinfo,
    build: process.env.HEROKU_SLUG_COMMIT?.slice(0, 7),
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
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  // pwa: {
  //   manifest: {
  //     lang: "en",
  //   },
  // },

  router: {
    middleware: ["pageGuard"],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.plugins) {
        config.resolve.plugins = [];
      }

      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: "tsconfig.json",
        })
      );
    },
    loaders: {
      vue: {
        transformAssetUrls: {
          ImageFader: ["src"],
        },
      },
    },
    // babel: {
    //   plugins: ["@nuxtjs/composition-api/dist/babel-plugin"],
    // },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: "http://" + serverConfig.host + ":" + serverConfig.port,
  },

  // https://windicss.org/integrations/nuxt.html
  windicss: {
    // cssPath: "assets/styles/tailwind.less",
    // configPath: "client/windi.config.ts",
    exposeConfig: false,
    viewer: false,
    config: windiConfig,
  },

  // https://marquez.co/docs/nuxt-optimized-images/configuration
  // optimizedImages: {
  //   optimizeImages: true,
  //   optimizeImagesInDev: true,
  // },

  ignore: ["**/*.test.*", ["**/migrations/Migration*.js"]],
} as NuxtConfig;
