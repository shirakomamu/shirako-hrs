import { NuxtConfig } from "@nuxt/types";
import appinfo from "./appinfo";

export default {
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
  css: [],

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
    "@nuxtjs/pwa",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    [
      "@dansmaculotte/nuxt-security",
      {
        dev: true,
        hsts: {
          maxAge: 63072000,
          includeSubDomains: true,
          preload: true,
        },
        // csp: {
        //   directives: {
        //     defaultSrc: ["'self'"],
        //     scriptSrc: ["'self'"],
        //     fontSrc: ["'self'"],
        //     imgSrc: ["'self'"],
        //     styleSrc: ["'self'"],
        //   },
        //   reportOnly: false,
        // },
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
  },

  privateRuntimeConfig: {
    axios: {
      baseURL:
        process.env.BASE_URL ||
        "http://" + appinfo.serverHost + ":" + appinfo.serverPort,
    },
  },

  server: {
    host: appinfo.serverHost,
    port: appinfo.serverPort,
    timing: false,
  },

  // Render configuration: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-render#csp
  render: {
    csp: {
      reportOnly: false,
      hashAlgorithm: "sha256",
      policies: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "img-src": ["'self'"],
        "style-src": ["'self'"],
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = "source-map";
      }
    },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: "http://" + appinfo.serverHost + ":" + appinfo.serverPort,
  },

  // TailwindCSS module configuration (https://tailwindcss.nuxtjs.org/options)
  tailwindcss: {
    // cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {},
  },
} as NuxtConfig;
