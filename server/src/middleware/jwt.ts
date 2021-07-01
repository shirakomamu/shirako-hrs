// import jwt from "express-jwt";
// import jwks from "jwks-rsa";

// const config: jwt.Options = {
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: process.env.AUTH0_ISSUER_BASE_URL + "/.well-known/jwks.json",
//   }),
//   audience: process.env.AUTH0_API_IDENTIFIER,
//   issuer: process.env.AUTH0_ISSUER_BASE_URL,
//   algorithms: ["RS256"],
// };

// export default jwt(config);
