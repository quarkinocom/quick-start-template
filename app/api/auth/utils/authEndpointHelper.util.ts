import "server-only";

import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export type TRolePayload = { slug: string; title: string; created_at: number };

export type TTokenPayloadRoles = {
  id?: string;
  organization?: {
    id: string;
    slug: string;
    name: string;
  };
  role: {
    id?: string;
    slug: string;
    title: string;
  };
  level?: number;
};

export type TJWTPayload = {
  id: string;
  name_first: string;
  name_full: string;
  dev: boolean;
  admin: boolean;
  preferences: object | null;
  "2fa": boolean;
  roles: TTokenPayloadRoles[];
};

export type TAuthResponse = {
  isLoggedIn: boolean;
  token: string;
  user: {
    id: string;
    firstName: string;
    fullName: string;
    preferences: object | null;
  };
  roles: TTokenPayloadRoles[];
  isAdmin: boolean;
  isDeveloper: boolean;
  twoFA: boolean;
  redirect?: string;
};

const defaultPayload: TAuthResponse = {
  isLoggedIn: false,
  token: "",
  user: { id: "", firstName: "", fullName: "", preferences: null },
  roles: [],
  isAdmin: false,
  isDeveloper: false,
  twoFA: false,
  redirect: undefined,
};

/**
 *
 * @param token A jwt token
 * @param roles A roles array
 * @returns returns a TAuthResponse object
 */
const parseJwtToken = (
  token: string,
  roles?: TRolePayload[]
): TAuthResponse => {
  if (!token) {
    return defaultPayload;
  }

  const decodedPayload = jwtDecode<{ payload: TJWTPayload }>(token).payload;

  return {
    isLoggedIn: true,
    isAdmin: decodedPayload.admin,
    isDeveloper: decodedPayload.dev,
    token: token,
    user: {
      id: decodedPayload.id,
      firstName: decodedPayload.name_first,
      fullName: decodedPayload.name_full,
      preferences: decodedPayload.preferences,
    },
    roles: roles
      ? roles.map((role) => {
          return {
            role: {
              title: role.title,
              slug: role.slug,
            },
          };
        })
      : decodedPayload.roles,
    twoFA: decodedPayload["2fa"],
  };
};

/**
 *
 * @param props The props object
 * @param props.token A jwt token
 * @param props.roles The user roles array
 * @param props.redirect Optional redirect route
 * @returns a NextResponse with a cookie
 */
const makeResponse = ({
  token,
  roles,
  redirect,
}: {
  token: string;
  roles?: TRolePayload[];
  redirect?: string;
}) => {
  try {
    if (!token) {
      const res = NextResponse.json(defaultPayload);

      res.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    const decodedPayload = jwtDecode<{ payload: TJWTPayload }>(token).payload;

    const res = NextResponse.json<TAuthResponse>({
      isLoggedIn: true,
      isAdmin: decodedPayload.admin,
      isDeveloper: decodedPayload.dev,
      token: token,
      user: {
        id: decodedPayload.id,
        firstName: decodedPayload.name_first,
        fullName: decodedPayload.name_full,
        preferences: decodedPayload.preferences,
      },
      roles: roles
        ? roles.map((role) => {
            return {
              role: {
                title: role.title,
                slug: role.slug,
              },
            };
          })
        : decodedPayload.roles,
      twoFA: decodedPayload["2fa"],
      redirect: redirect,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { hasError: true, message: error.message, trace: error, isNext: true },
        { status: 500 }
      );
    }
  }
};

export { makeResponse, parseJwtToken };
