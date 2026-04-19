"use client";

import { useParams } from 'next/navigation';
import { useEquipmentQuery } from "@/hooks/equipment/useEquipmentQuery";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useTranslations } from "next-intl";

export default function EquipmentDetailForm() {
  const t = useTranslations("Equipment.detail");
  const tFields = useTranslations("Equipment.detail.fields");
  const params = useParams();
  const id = params?.id as string;

  const { data: equipment, isLoading, error } = useEquipmentQuery(id);

  if (isLoading) {
    return <Loading message={t("loading")} />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!equipment) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className="w-full">
        <h1>{t("title")}</h1>
        <div className="flex flex-col gap-2">
            <p>{tFields("id")}: {equipment.id}</p>
            <p>{tFields("name")}: {equipment.name}</p>
            <p>{tFields("location")}: {equipment.location}</p>
            <p>{tFields("status")}: {equipment.isActive ? tFields("active") : tFields("inactive")}</p>
        </div>
    </div>
  );
}

