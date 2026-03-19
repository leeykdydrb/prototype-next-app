import { NextRequest } from "next/server";
import type { CodeData, CodeInput } from "@/types/code";
import { prisma } from "@/lib/prisma";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";

type HandlerContext = {
  params: Promise<Record<string, string>>;
};

// 코드 수정
export const PUT = withPermissionGuard('code.update', async (req: NextRequest, context: HandlerContext) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return ApiResponse.error("유효하지 않은 코드 ID입니다.", 400);
    }
    
    const body: CodeInput = await req.json();
    const { code, codeName, description, sortOrder, isActive } = body;

    // 필수 값 검증
    if (!code || !codeName) {
      return ApiResponse.error("필수 값이 누락되었습니다.", 400);
    }

    // 존재 여부 확인
    const existingCode = await prisma.code.findUnique({
      where: { id }
    });

    if (!existingCode) {
      return ApiResponse.error("코드를 찾을 수 없습니다.", 404);
    }

    // 시스템 코드 수정 제한
    if (existingCode.isSystem) {
      return ApiResponse.error("시스템 코드는 수정할 수 없습니다.", 403);
    }

    // 중복 검사 (같은 그룹 내에서 다른 코드와 중복되는지)
    if (code !== existingCode.code) {
      const duplicateCode = await prisma.code.findFirst({
        where: {
          groupId: existingCode.groupId,
          code,
          NOT: { id }
        }
      });

      if (duplicateCode) {
        return ApiResponse.error("해당 그룹에 이미 존재하는 코드입니다.", 400);
      }
    }

    const updatedCode = await prisma.code.update({
      where: { id },
      data: {
        code,
        codeName,
        description,
        sortOrder,
        isActive,
      },
      include: {
        group: true
      }
    });

    return ApiResponse.success<CodeData>(updatedCode, "코드가 수정되었습니다.");
  } catch (error) {
    console.error("코드 수정 실패:", error);
    return ApiResponse.error("코드 수정에 실패했습니다.", 500);
  }
});

// 코드 삭제
export const DELETE = withPermissionGuard('code.delete', async (req: NextRequest, context: HandlerContext) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return ApiResponse.error("유효하지 않은 코드 ID입니다.", 400);
    }

    // 존재 여부 확인
    const existingCode = await prisma.code.findUnique({
      where: { id }
    });

    if (!existingCode) {
      return ApiResponse.error("코드를 찾을 수 없습니다.", 404);
    }

    // 시스템 코드 삭제 제한
    if (existingCode.isSystem) {
      return ApiResponse.error("시스템 코드는 삭제할 수 없습니다.", 403);
    }

    await prisma.code.delete({
      where: { id }
    });

    return ApiResponse.success(null, "코드가 삭제되었습니다.");
  } catch (error) {
    console.error("코드 삭제 실패:", error);
    return ApiResponse.error("코드 삭제에 실패했습니다.", 500);
  }
});
