import { auth, ConfigParams } from "express-openid-connect";

const config: ConfigParams = {
  routes: {
    // login: "/auth/login",
    // logout: "/auth/logout",
    callback: "/auth/callback", // registered in the redirect uri
    // postLogoutRedirect: "/",
  },
  authorizationParams: {
    response_type: "code",
    audience: process.env.AUTH0_API_IDENTIFIER,
    scope: "openid email profile offline_access",
  },
  authRequired: false,
  auth0Logout: true,
  idpLogout: false,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.SERVER_BASE_URI + "/api",
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

export default auth(config);
