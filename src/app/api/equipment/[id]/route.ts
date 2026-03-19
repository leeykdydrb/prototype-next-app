import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
import type { Equipment } from "@/types/equipment";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from "@/lib/prisma";

export const GET = withAuthGuard(async (_req, { params }) => {
  const { id } = await params;
  const equipment = await prisma.equipment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!equipment) {
    return ApiResponse.error("설비 정보를 찾을 수 없습니다.", 400)
  }
  
  return ApiResponse.success<Equipment>(equipment);
});

// export const PUT = auth(async function PUT(req, { params }: { params: Promise<{ id: string }> }) {
export const PUT = withPermissionGuard('equipment.update', async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();

  const updatedEquipment = await prisma.equipment.update({
    where: { id: Number(id) },
    data: body,
  });

  // const updatedEquipment = {
  //   id: Number(id),
  //   name: body.name,
  //   location: body.location,
  //   isActive: body.isActive,
  //   updatedAt: new Date().toISOString(),
  // };

  // return ApiResponse.error("설비 업데이트 실패", 400)

  return ApiResponse.success<Equipment>(updatedEquipment, "설비 정보 수정 완료");
});
