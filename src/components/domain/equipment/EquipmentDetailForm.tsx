"use client";

import { useParams } from 'next/navigation';
import { useEquipmentQuery } from "@/hooks/equipment/useEquipmentQuery";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function EquipmentDetailForm() {
  const params = useParams();
  const id = params?.id as string;

  const { data: equipment, isLoading, error } = useEquipmentQuery(id);

  if (isLoading) {
    return <Loading message="설비 정보를 불러오는 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!equipment) {
    return <div>설비를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full">
        <h1>설비 상세페이지</h1>
        <div className="flex flex-col gap-2">
            <p>설비 ID: {equipment.id}</p>
            <p>설비 이름: {equipment.name}</p>
            <p>설비 위치: {equipment.location}</p>
            <p>가동 상태: {equipment.isActive ? "가동 중" : "정지"}</p>
        </div>
    </div>
  );
}

