export default {
  serverHost: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
  serverPort: process.env.PORT || 3000,
  name: "HRBAC Demo",
  description: "Demo for the HRBAC system.",
  favicon: "hrs-32b.png",
  headerIconWhenLight: "hrs-128t.png",
  headerIconWhenDark: "hrs-128t.png",
  version: process.env.npm_package_version || "unknown",
};
