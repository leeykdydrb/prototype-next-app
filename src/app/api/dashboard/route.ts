import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { DashboardData } from "@/types/dashboard";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from "@/lib/prisma";

export const GET = withAuthGuard(async () => {
  // 테스트용 mock 데이터
  // const data = {
  //   boardId: "board01",
  //   boardName: "대시보드01",
  //   notice: "이 대시보드는 당신만을 위한 것입니다.",
  // };

  // DB Dashboard 조회
  const dashboard = await prisma.dashboard.findMany();

  // return ApiResponse.error( "대시보드 데이터가 존재하지 않습니다.")

  return ApiResponse.success<DashboardData[]>(dashboard);
});
