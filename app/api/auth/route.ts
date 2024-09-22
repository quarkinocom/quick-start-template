import { NextResponse, NextRequest } from "next/server";

import { getPersonsEndpoints } from "@quarkino/services/server";
import { makeResponse } from "@/app/api/auth/utils/authEndpointHelper.util";

/**
 * This method checks for the validity of users login
 * @param req The standard NextRequest object
 * @returns An standard NextResponse of type TResponseJSON
 */
export const GET = async (req: NextRequest) => {
  const tokenCookie = req.cookies.get("token")?.value;

  if (!tokenCookie) {
    return makeResponse({ token: "" });
  }

  const revalidationRes =
    await getPersonsEndpoints.check.get.checkToken.request({
      useToken: true,
    });

  if (revalidationRes.data?.status !== 200) {
    return makeResponse({ token: "" });
  }

  return makeResponse({
    token: tokenCookie,
    roles: revalidationRes.data?.results.roles,
  });
};

/**
 * This method will be used for registration
 * @param req The standard NextRequest object
 * @returns An standard NextResponse of type TResponseJSON
 */
export const POST = async (req: NextRequest) => {
  try {
    const { cookies, nextUrl } = req;

    const requestBody = await req.json();
    const redirect = nextUrl.searchParams.get("redirect") || undefined;

    const tokenCookie = cookies.get("token")?.value;

    if (tokenCookie) {
      return NextResponse.json(
        { message: "User is already logged in.", isNext: true },
        { status: 403 }
      );
    }

    const result = await getPersonsEndpoints.userRegister.post.register.request(
      {
        data: requestBody,
        useToken: true,
      }
    );

    if (!result.data) {
      throw new Error("no data");
    }

    if (result.data.status >= 300) {
      return NextResponse.json(
        { message: result.data.userMessage },
        { status: result.data.status }
      );
    }

    if (!result.data.results?.access_token) {
      throw new Error("no access token");
    }

    return makeResponse({ token: result.data.results.access_token, redirect });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { hasError: true, message: error.message, trace: error, isNext: true },
        { status: 500 }
      );
    }
  }
};
