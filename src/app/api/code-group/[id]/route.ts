import { NextRequest } from "next/server";
import type { CodeGroupData, CodeGroupInput } from "@/types/code-group";
import { prisma } from "@/lib/prisma";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

// 코드 그룹 수정
export const PUT = withPermissionGuard('code.update', async (req: NextRequest, context: HandlerContext) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return ApiResponse.error("유효하지 않은 코드 그룹 ID입니다.", 400);
    }
    
    const body: CodeGroupInput = await req.json();
    const { groupCode, groupName, description, parentId, isActive } = body;

    // 필수 값 검증
    if (!groupCode || !groupName) {
      return ApiResponse.error("필수 값이 누락되었습니다.", 400);
    }

    // 존재 여부 확인
    const existingGroup = await prisma.codeGroup.findUnique({
      where: { id }
    });

    if (!existingGroup) {
      return ApiResponse.error("코드 그룹을 찾을 수 없습니다.", 404);
    }

    // 시스템 그룹 수정 제한
    if (existingGroup.isSystem) {
      return ApiResponse.error("시스템 코드 그룹은 수정할 수 없습니다.", 403);
    }

    // 중복 검사 (다른 그룹과 중복되는지)
    if (groupCode !== existingGroup.groupCode) {
      const duplicateGroup = await prisma.codeGroup.findFirst({
        where: {
          groupCode,
          NOT: { id }
        }
      });

      if (duplicateGroup) {
        return ApiResponse.error("이미 존재하는 그룹 코드입니다.", 400);
      }
    }

    const updatedGroup = await prisma.codeGroup.update({
      where: { id },
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

    return ApiResponse.success<CodeGroupData>(updatedGroup, "코드 그룹이 수정되었습니다.");
  } catch (error) {
    console.error("코드 그룹 수정 실패:", error);
    return ApiResponse.error("코드 그룹 수정에 실패했습니다.", 500);
  }
});

// 코드 그룹 삭제
export const DELETE = withPermissionGuard('code.delete', async (req: NextRequest, context: HandlerContext) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return ApiResponse.error("유효하지 않은 코드 그룹 ID입니다.", 400);
    }

    // 존재 여부 확인
    const existingGroup = await prisma.codeGroup.findUnique({
      where: { id },
      include: {
        _count: {
          select: { codes: true }
        }
      }
    });

    if (!existingGroup) {
      return ApiResponse.error("코드 그룹을 찾을 수 없습니다.", 404);
    }

    // 시스템 그룹 삭제 제한
    if (existingGroup.isSystem) {
      return ApiResponse.error("시스템 코드 그룹은 삭제할 수 없습니다.", 403);
    }

    // 하위 코드가 있는 경우 경고
    if (existingGroup._count.codes > 0) {
      return ApiResponse.error(`이 그룹에는 ${existingGroup._count.codes}개의 코드가 있습니다. 먼저 코드를 삭제하거나 다른 그룹으로 이동해주세요.`, 400);
    }

    await prisma.codeGroup.delete({
      where: { id }
    });

    return ApiResponse.success(null, "코드 그룹이 삭제되었습니다.");
  } catch (error) {
    console.error("코드 그룹 삭제 실패:", error);
    return ApiResponse.error("코드 그룹 삭제에 실패했습니다.", 500);
  }
}); 