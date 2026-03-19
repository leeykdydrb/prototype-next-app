import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CodeGroupData, CodeGroupInput } from "@/types/code-group";
import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";

// 코드 그룹 목록 조회
export const GET = withAuthGuard(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get("isActive");

    const where: {
      OR?: Array<{
        groupCode?: { contains: string; mode: 'insensitive' };
        groupName?: { contains: string; mode: 'insensitive' };
      }>;
      isActive?: boolean;
    } = {};

    // 검색 조건
    if (search) {
      where.OR = [
        { groupCode: { contains: search, mode: "insensitive" } },
        { groupName: { contains: search, mode: "insensitive" } },
      ];
    }

    // 활성/비활성 필터
    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true";
    }

    const codeGroups = await prisma.codeGroup.findMany({
      where,
      include: {
        _count: {
          select: { codes: true }
        }
      },
      orderBy: [
        { isSystem: "desc" },
        { groupCode: "asc" }
      ],
    });

    return ApiResponse.success<CodeGroupData[]>(codeGroups);
  } catch (error) {
    console.error("코드 그룹 목록 조회 실패:", error);
    return ApiResponse.error("코드 그룹 목록 조회에 실패했습니다.", 500);
  }
});

// 코드 그룹 생성
export const POST = withPermissionGuard('code.create', async (request: NextRequest) => {
  try {
    const body: CodeGroupInput = await request.json();
    const { groupCode, groupName, description, parentId, isActive = true } = body;

    // 필수 값 검증
    if (!groupCode || !groupName) {
      return ApiResponse.error("필수 값이 누락되었습니다.", 400);
    }

    // 중복 검사
    const existingGroup = await prisma.codeGroup.findUnique({
      where: { groupCode }
    });

    if (existingGroup) {
      return ApiResponse.error("이미 존재하는 그룹 코드입니다.", 400);
    }

    const codeGroup = await prisma.codeGroup.create({
      data: {
        groupCode,
        groupName,
        description,
        parentId: parentId || null,
        isActive,
      },
      include: {
        _count: {
          select: { codes: true }
        }
      }
    });

    return ApiResponse.success<CodeGroupData>(codeGroup, "코드 그룹이 생성되었습니다.");
  } catch (error) {
    console.error("코드 그룹 생성 실패:", error);
    return ApiResponse.error("코드 그룹 생성에 실패했습니다.", 500);
  }
}); 