import { NextFunction, Request, Response } from "express";
import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { SrkCookie, AuthType } from "src/services/jwt";
import Actor from "src/classes/Actor";
import { RoleGroup } from "src/services/hrbac";
import SrkError from "src/classes/SrkError";

// .getUserInfo()
// {
//   sub: 'auth0|random-id-here',
//   nickname: 'mamu',
//   name: '白子マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true
// }
// .idTokenClaims
// {
//   nickname: 'mamu',
//   name: '白子マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true,
//   iss: 'https://shirako-dev.us.auth0.com/',
//   sub: 'auth0|random-id-here',
//   aud: '9VArZeU8DFTTYGZ8gFkH9jxCuIoITyah',
//   iat: 1624299685,
//   exp: 1624335685,
//   nonce: 'DCSAw7Mgb0ap_js3Qn0Wv1o5pwiHoQPuW0R0p_xLlGE'
// }
// .user
// {
//   nickname: 'mamu',
//   name: '白子マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true,
//   sub: 'auth0|random-id-here'
// }
// Access token
// {
//   iss: 'https://shirako-dev.us.auth0.com/',
//   sub: 'auth0|random-id-here',
//   aud: [
//     'https://hrs/api',
//     'https://shirako-dev.us.auth0.com/userinfo'
//   ],
//   iat: 1624309702,
//   exp: 1624396102,
//   azp: '9VArZeU8DFTTYGZ8gFkH9jxCuIoITyah',
//   scope: 'openid profile email offline_access',
//   permissions: []
// }

const client = jwksClient({
  jwksUri: process.env.AUTH0_ISSUER_BASE_URL + ".well-known/jwks.json",
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600, // Defaults to 10m
});

function getKey(header: JwtHeader, callback: Function) {
  client.getSigningKey(header.kid, (_err, key) => {
    callback(null, key.getPublicKey());
  });
}

// async function getSigningKey() {
//   const key = await client.getSigningKey(kid);
//   const signingKey = key.getPublicKey();
// }

export default async (req: Request, res: Response, next: NextFunction) => {
  // console.log(result);

  // const jwtCheck = await jwt.verify(access_token);
  // console.log("Adding user data", Date.now(), req.url);
  // if no jwt is provided in signed cookie

  // console.log(req.oidc.accessToken);
  // console.log(req.headers);
  if (!req.oidc.isAuthenticated || !req.oidc.user || !req.oidc.accessToken) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    return next();
  }

  try {
    // eslint-disable-next-line camelcase
    let { access_token } = req.oidc.accessToken;
    const { isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
      // eslint-disable-next-line camelcase
      ({ access_token } = await refresh());
    }

    jwt.verify(
      access_token,
      getKey,
      {
        algorithms: ["RS256"],
        audience: process.env.AUTH0_API_IDENTIFIER,
        issuer: process.env.AUTH0_ISSUER_BASE_URL,
      },
      (err, result) => {
        if (err) {
          throw err;
        }

        const user = req.oidc.user as {
          nickname?: string;
          name: string;
          picture: string;
          // eslint-disable-next-line camelcase
          updated_at: string;
          email: string;
          // eslint-disable-next-line camelcase
          email_verified: boolean;
          sub: string;
        };

        if (result?.sub !== user.sub) {
          throw new SrkError("failedLogin");
        }

        res.locals.authResult = {
          authType: AuthType.auth0,
          actor: new Actor({
            id: AuthType.auth0 + "://" + user.sub,
            username: user.name,
            email: user.email,
            avatar: user.picture,
            cohort: null,
            key: null,
            rgs: user.email_verified
              ? [RoleGroup.member_verified]
              : [RoleGroup.member],
            roles: [],
          }),
        } as SrkCookie;
        next();
      }
    );
  } catch (e) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    next();
  }
};
