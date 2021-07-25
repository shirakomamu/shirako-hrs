import { NextFunction, Request, Response } from "express";
// import { JwtHeader } from "jsonwebtoken";
// import jwksClient from "jwks-rsa";
import { SrkCookie, AuthType } from "server/services/jwt";
import Actor from "server/classes/Actor";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import transformUserToActor from "server/services/auth0-mgmt/transformUserToActor";
import { splitKey, validateKey } from "server/services/api-key";

// .getUserInfo()
// {
//   sub: 'auth0|60cd8d8f34a3650069ed5923',
//   nickname: 'mamu',
//   name: '白狐マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true
// }
// .idTokenClaims
// {
//   nickname: 'mamu',
//   name: '白狐マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true,
//   iss: 'https://shirako-dev.us.auth0.com/',
//   sub: 'auth0|60cd8d8f34a3650069ed5923',
//   aud: '9VArZeU8DFTTYGZ8gFkH9jxCuIoITyah',
//   iat: 1624299685,
//   exp: 1624335685,
//   nonce: 'DCSAw7Mgb0ap_js3Qn0Wv1o5pwiHoQPuW0R0p_xLlGE'
// }
// .user
// {
//   nickname: 'mamu',
//   name: '白狐マム',
//   picture: 'https://s.gravatar.com/avatar/6c8dabb2b76a6bf4ad94bf2729fe0a99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png',
//   updated_at: '2021-06-21T05:52:31.367Z',
//   email: 'mamu@shirako.dev',
//   email_verified: true,
//   sub: 'auth0|60cd8d8f34a3650069ed5923'
// }

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.locals) {
    req.locals = {};
  }

  // attempt to authenticate api key first if it's provided
  const apiKey = req.header("authorization");
  if (apiKey && apiKey.startsWith("Bearer ")) {
    try {
      const token = apiKey.replace("Bearer ", "");
      const isKeyValid = await validateKey(token);

      if (!isKeyValid) {
        req.locals.authResult = {
          authType: AuthType.none,
        } as SrkCookie;
        return next();
      }

      const { sub } = splitKey(token) as { sub: string };
      const userinfo = await getUserCached({ id: sub });

      req.locals.authResult = {
        authType: AuthType.auth0,
        actor: new Actor({
          ...transformUserToActor(userinfo),
          key: true,
        }),
      } as SrkCookie;
    } catch (e) {
      req.locals.authResult = {
        authType: AuthType.none,
      } as SrkCookie;
    } finally {
      next();
    }

    return;
  }

  if (
    !req.oidc.isAuthenticated() ||
    !req.oidc.user ||
    !req.oidc.accessToken ||
    !req.oidc.idTokenClaims
  ) {
    req.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    return next();
  }

  try {
    const [userinfo] = await Promise.all([
      getUserCached({ id: req.oidc.user.sub }),
      req.oidc.accessToken.isExpired() ? req.oidc.accessToken.refresh() : null,
    ]);

    req.locals.authResult = {
      authType: AuthType.auth0,
      actor: new Actor(transformUserToActor(userinfo)),
    } as SrkCookie;
  } catch (e) {
    req.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
  } finally {
    next();
  }
};
