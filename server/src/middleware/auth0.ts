import { auth, ConfigParams } from "express-openid-connect";

const config: ConfigParams = {
  routes: {
    // login: "/auth/login",
    // logout: "/auth/logout",
    callback: "/auth/callback", // registered in the redirect uri
    // postLogoutRedirect: "/",
  },
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.SERVER_BASE_URI,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

export default auth(config);
