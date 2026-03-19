// hooks/useEquipmentQuery.ts
// 설비 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["equipment"] → 캐시 식별자 역할
// - URL: /api/equipment
// - 필요 시 쿼리파라미터 (page, size 등)

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { Equipment, EquipmentInput } from "@/types/equipment";

export const useEquipmentQuery = (id: string) =>
  useApiQuery<Equipment>(["equipment", id], `/api/equipment/${id}`);

export const useEquipmentCreate = () =>
  useApiMutation<Equipment, EquipmentInput>("/api/equipment", "POST");

export const useEquipmentUpdate = (id: string) =>
  useApiMutation<Equipment, EquipmentInput>(`/api/equipment/${id}`, "PUT");