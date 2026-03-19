import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { CodeData, CodeInput } from "@/types/code";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = withAuthGuard(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const groupId = searchParams.get("groupId");
  const groupCode = searchParams.get("groupCode");
  const isActive = searchParams.get("isActive");

  const where: {
    OR?: Array<{
      code?: { contains: string; mode: 'insensitive' };
      codeName?: { contains: string; mode: 'insensitive' };
    }>;
    group?: {
      groupCode?: string
    };
    groupId?: number;
    isActive?: boolean;
  } = {};

  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { codeName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (groupId) where.groupId = Number(groupId);
  else if (groupCode) where.group = { groupCode };

  // 활성 상태 필터
  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === "true";
  }

  const codes = await prisma.code.findMany({
    where,
    include: { group: true },
    orderBy: [{ groupId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
  });

  return ApiResponse.success<CodeData[]>(codes);
});

export const POST = withPermissionGuard('code.create', async (req: NextRequest) => {
  try {
    const body: CodeInput = await req.json();
    const { groupId, code, codeName, description, sortOrder = 0, isActive = true, isSystem = false } = body;

    if (!groupId || !code || !codeName) {
      return ApiResponse.error("필수값이 누락되었습니다.", 400);
    }

    // 중복 체크 (groupId+code unique)
    const exists = await prisma.code.findUnique({
      where: { groupId_code: { groupId: groupId, code: code } },
    });
    if (exists) {
      return ApiResponse.error("이미 존재하는 코드입니다.", 400);
    }

    const newCode = await prisma.code.create({
      data: {
        groupId,
        code,
        codeName,
        description,
        sortOrder,
        isActive,
        isSystem,
      },
      include: { group: true }
    });

    return ApiResponse.success<CodeData>(newCode, "코드가 성공적으로 생성되었습니다.");
  } catch (error) {
    console.error("Code create error:", error);
    return ApiResponse.error("코드 생성 중 오류가 발생했습니다.", 500);
  }
});