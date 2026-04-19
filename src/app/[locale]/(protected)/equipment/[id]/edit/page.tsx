"use client";

import { useParams } from 'next/navigation'
import { useState, useEffect } from "react";
import { useEquipmentQuery, useEquipmentUpdate } from "@/hooks/equipment/useEquipmentQuery";
import { ApiError } from "@/lib/api/ApiError";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useTranslations } from "next-intl";

export default function EquipmentEditForm() {
  const t = useTranslations("Equipment.edit");
  const tFields = useTranslations("Equipment.edit.fields");
  const tActions = useTranslations("Equipment.edit.actions");
  const tMsg = useTranslations("Equipment.edit.messages");
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

  if (isLoading) return <Loading message={t("loading")} />;
  if (fetchError) return <ErrorMessage message={fetchError.message} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, location, isActive },
      {
        onSuccess: (data) => {
          setMessage(`✅ ${tMsg("updated", { name: data.name })}`);
        },
        // onError: (err) => {
        //   setMessage(`❌ 수정 실패: ${err.message}`);
        // },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t("title")}</h2>
      <input
        type="text"
        placeholder={tFields("namePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder={tFields("locationPlaceholder")}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        {tFields("isActiveLabel")}
      </label>
      <button type="submit" disabled={isPending}>
        {tActions("save")}
      </button>
      {message && <p>{message}</p>}
      {updateError instanceof ApiError && updateError.status !== 401 && <p style={{ color: "red" }}>{updateError.message}</p>}
    </form>
  );
}
