import { NextResponse, NextRequest } from "next/server";

import { makeResponse } from "@/app/api/auth/utils/authEndpointHelper.util";

/**
 *
 * This method will be used for login
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

    if (!requestBody.token) {
      return NextResponse.json(
        { message: "Bad request", isNext: true },
        { status: 403 }
      );
    }

    return makeResponse({ token: requestBody.token, redirect });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { hasError: true, message: error.message, trace: error, isNext: true },
        { status: 500 }
      );
    }
  }
};
