"use client";

import { useParams } from 'next/navigation'
import { useState, useEffect } from "react";
import { useEquipmentQuery, useEquipmentUpdate } from "@/hooks/equipment/useEquipmentQuery";
import { ApiError } from "@/lib/api/ApiError";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function EquipmentEditForm() {
  const params = useParams()
  const id = params?.id as string

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");
  
  const { data: equipment, isLoading, error: fetchError } = useEquipmentQuery(id);
  const { mutate, isPending, error: updateError } = useEquipmentUpdate(id);

  useEffect(() => {
    if (equipment) {
      setName(equipment.name);
      setLocation(equipment.location);
      setIsActive(equipment.isActive);
    }
  }, [equipment]);

  if (isLoading) return <Loading message="설비 정보를 불러오는 중입니다..." />;
  if (fetchError) return <ErrorMessage message={fetchError.message} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, location, isActive },
      {
        onSuccess: (data) => {
          setMessage(`✅ ${data.name} 설비가 성공적으로 수정되었습니다.`);
        },
        // onError: (err) => {
        //   setMessage(`❌ 수정 실패: ${err.message}`);
        // },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>설비 수정</h2>
      <input
        type="text"
        placeholder="설비 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="설비 위치"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        가동 중
      </label>
      <button type="submit" disabled={isPending}>
        저장
      </button>
      {message && <p>{message}</p>}
      {updateError instanceof ApiError && updateError.status !== 401 && <p style={{ color: "red" }}>{updateError.message}</p>}
    </form>
  );
}
