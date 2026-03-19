import { auth } from "@/lib/auth-keycloak";
import type { Session } from "next-auth";
import type { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api/apiResponse";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

export function withAuthGuard(
  handler: (req: NextRequest & { auth: Session }, context: HandlerContext) => Promise<NextResponse>
) {
  return auth(async (req, context) => {
    if (!req.auth?.user) {
      return ApiResponse.unauthorized();
    }

    try {
      return await handler(req as NextRequest & { auth: Session }, context);
    } catch (error) {
      console.error("API Error:", error);
      return ApiResponse.error("서버 내부 오류가 발생했습니다.", 500);
    }
  });
}