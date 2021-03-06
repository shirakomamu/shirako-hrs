import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import redirectSsl from "redirect-ssl";
import appinfo from "./appinfo";
// windi doesn't seem to play nice with non-root srcDir

const serverConfig = {
  host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
  port: process.env.PORT || 3000,
};

/**
 * @type {import('@nuxt/types').NuxtConfig}
 */
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
        type: "image/png",
        href: appinfo.favicon,
      },
      {
        rel: "apple-touch-icon",
        type: "image/png",
        href: "icons/192-or-w.png",
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
    "nuxt-windicss",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
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

  server: {
    host: serverConfig.host,
    port: serverConfig.port,
    timing: false,
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      theme_color: "#ff7600",
    },
    workbox: {
      // enabled: true,
      // offline: false,
    },
    manifest: {
      name: appinfo.name, // actual name
      short_name: appinfo.name, // displayed on desktop or mobile
      description: appinfo.description,
      lang: "en",
      background_color: "#191919",
    },
    icon: {
      source: appinfo.favicon,
      fileName: "icons/512-or-w.png",
    },
  },

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
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: "http://" + serverConfig.host + ":" + serverConfig.port,
  },

  // https://windicss.org/integrations/nuxt.html
  windicss: {
    exposeConfig: false,
    viewer: false,
    config: {
      darkMode: "media", // false or 'media' or 'class'
      theme: {
        extend: {
          colors: {
            "blue-srk": "#0089ff",
            "orange-srk": "#ff7600",
          },
        },
      },
      plugins: [],
    },
  },

  serverMiddleware: [
    redirectSsl.create({
      enabled: process.env.NODE_ENV === "production",
    }),
  ],

  ignore: ["**/*.test.*", ["**/migrations/Migration*.js"]],
};
