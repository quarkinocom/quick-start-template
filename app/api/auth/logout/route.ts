import { NextResponse, NextRequest } from "next/server";

import { getPersonsEndpoints } from "@quarkino/services/server";
import { makeResponse } from "@/app/api/auth/utils/authEndpointHelper.util";

/**
 *
 * This method will be used for Logout
 * @param req The standard NextRequest object
 * @returns An standard NextResponse of type TAuthResponse OR A status message
 */
export const POST = async (req: NextRequest) => {
  try {
    const { cookies } = req;

    const tokenCookie = cookies.get("token")?.value;

    if (!tokenCookie) {
      return NextResponse.json(
        { message: "No user is logged in right now", isNext: true },
        { status: 403 }
      );
    }

    const result = await getPersonsEndpoints.logout.post.logout.request({
      useToken: true,
      data: undefined,
    });

    if (!result.data) {
      throw new Error("no data");
    }

    if (result.data.status !== 200) {
      return NextResponse.json(
        { message: result.data.userMessage },
        { status: result.data.status }
      );
    }

    return makeResponse({ token: "" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { hasError: true, message: error.message, trace: error, isNext: true },
        { status: 500 }
      );
    }
  }
};
