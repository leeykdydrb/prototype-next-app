import { withPermissionGuard } from "@/lib/auth/withPermissionGuard";
import { ApiResponse } from "@/lib/api/apiResponse";
// import { nanoid } from "nanoid";
import type { Equipment } from "@/types/equipment";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from "@/lib/prisma";

export const POST = withPermissionGuard('equipment.create', async (req) => {
  const body = await req.json();

  const newEquipment = await prisma.equipment.create({ data: body });

  // const newEquipment = {
  //   id: 1,
  //   name: body.name,
  //   location: body.location,
  //   isActive: body.isActive,
  //   createdAt: new Date().toISOString(),
  // };

  return ApiResponse.success<Equipment>(newEquipment, "설비가 성공적으로 등록되었습니다.");
});
