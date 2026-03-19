import type { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";
import { ApiResponse } from "@/lib/api/apiResponse";
import { auth } from "@/lib/auth-keycloak";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

export function withRoleGuard(allowedRoles: string[]) {
  return function (
    handler: (
      req: NextRequest & { auth: Session },
      context: HandlerContext
    ) => Promise<NextResponse>
  ) {
    return auth(async (req, context) => {
      const session = req.auth;

      // 인증 실패
      if (!session?.user) {
        return ApiResponse.unauthorized();
      }

      // 역할이 허용되지 않음
      const userRole = session.user.role;
      if (!allowedRoles.includes(userRole)) {
        return ApiResponse.error("접근 권한이 없습니다.", 403);
      }

      try {
        return await handler(req as NextRequest & { auth: Session }, context);
      } catch (error) {
        console.error("API Error:", error);
        return ApiResponse.error("서버 내부 오류가 발생했습니다.", 500);
      }
    });
  };
}
