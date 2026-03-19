// src/lib/auth/withPermissionGuard.ts
// 권한 체크를 자동화하는 미들웨어
// - withAuthGuard + 권한 체크를 결합
// - API별로 필요한 권한을 자동으로 검증

import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { getUserEffectivePermissions } from "./permissionCheck";
import type { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api/apiResponse";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

/**
 * 권한 가드 미들웨어
 * @param requiredPermission 필요한 권한명
 * @param handler 실제 API 핸들러
 */
export const withPermissionGuard = (
  requiredPermission: string,
  handler: (req: NextRequest, context: HandlerContext) => Promise<NextResponse>
) => {
  return withAuthGuard(async (req, context) => {
    const userId = req.auth.user?.id;

    if (!userId) {
      return ApiResponse.unauthorized();
    }
    
    // 유저의 유효한 권한 목록 조회
    const effectivePermissions = await getUserEffectivePermissions(userId);
    
    // 권한 체크
    if (!effectivePermissions.includes(requiredPermission)) {
      return ApiResponse.error("해당 요청에 대한 권한이 없습니다.", 403);
    }
    
    // 권한이 있으면 실제 핸들러 실행
    return handler(req, context);
  });
};
