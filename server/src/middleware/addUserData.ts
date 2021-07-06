import { NextFunction, Request, Response } from "express";
// import { JwtHeader } from "jsonwebtoken";
// import jwksClient from "jwks-rsa";
import { SrkCookie, AuthType } from "src/services/jwt";
import Actor from "src/classes/Actor";
import { Auth0UserMetadataDto } from "@@/common/dto/auth";
import getUserCached from "src/services/auth0-mgmt/getUserCached";
import assert from "@@/common/utils/assert";
import { RoleGroup } from "@@/common/enums/hrbac";

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

export default async (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.oidc.isAuthenticated() ||
    !req.oidc.user ||
    !req.oidc.accessToken ||
    !req.oidc.idTokenClaims
  ) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    return next();
  }

  try {
    // const userinfo = await req.oidc.fetchUserInfo();
    const userinfo = await getUserCached(req.oidc.user.sub);

    // roles are gotten from the ID token, which expires after 1 hour
    const tokenRoles: string[] =
      req.oidc.user[`${process.env.CUSTOM_CLAIM_NAMESPACE}roles`] || [];

    const roles = [];
    const prefix = process.env.ID_TOKEN_ROLES_PREFIX;
    if (prefix) {
      assert<string>(prefix);
      roles.push(
        ...(tokenRoles
          .filter((e) => e.startsWith(prefix))
          .map((e) => e.replace(prefix, "")) as RoleGroup[])
      );
    }

    res.locals.authResult = {
      authType: AuthType.auth0,
      actor: new Actor({
        id: userinfo.user_id || "N/A",
        username: userinfo.username || "N/A",
        nickname: userinfo.nickname || "N/A",
        email: userinfo.email || "N/A",
        avatar:
          process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL ||
          userinfo.picture ||
          "",
        cohort: null,
        key: null,
        rgs: userinfo.email_verified
          ? [RoleGroup.member_verified, ...roles]
          : [RoleGroup.member, ...roles],
        meta: (userinfo.user_metadata as Auth0UserMetadataDto) || {},
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
