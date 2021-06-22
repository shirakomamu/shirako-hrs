import { NextFunction, Request, Response } from "express";
// import { JwtHeader } from "jsonwebtoken";
// import jwksClient from "jwks-rsa";
import { SrkCookie, AuthType } from "src/services/jwt";
import Actor from "src/classes/Actor";
import { RoleGroup } from "src/services/hrbac";

// .getUserInfo()
// {
//   sub: 'auth0|60cd8d8f34a3650069ed5923',
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
//   sub: 'auth0|60cd8d8f34a3650069ed5923',
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
//   sub: 'auth0|60cd8d8f34a3650069ed5923'
// }

export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.oidc.isAuthenticated || !req.oidc.user || !req.oidc.idTokenClaims) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    return next();
  }

  try {
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

    res.locals.authResult = {
      authType: AuthType.auth0,
      actor: new Actor({
        id: AuthType.auth0 + "://" + user.sub,
        username:
          (req.oidc.idTokenClaims[
            `${process.env.CUSTOM_CLAIM_NAMESPACE}username`
          ] as string | undefined) || user.name,
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
  } catch (e) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
  } finally {
    next();
  }
};
