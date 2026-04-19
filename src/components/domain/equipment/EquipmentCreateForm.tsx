"use client";

import { useState } from "react";
import { useJobRequest, JobStatus, JsonObject } from "@/components/mq/JobStatus";
import { Card, CardContent, CardHeader } from "@/components/framework/layout";
import { Button, FormField, FormGroup, FormSection, Input, Label, Switch } from "@/components/framework/form";
import { Alert } from "@/components/framework/feedback";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EquipmentCreateForm() {
  const t = useTranslations("Equipment.create");
  const tFields = useTranslations("Equipment.create.fields");
  const tJob = useTranslations("Equipment.create.job");
  const tMsg = useTranslations("Equipment.create.messages");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");

  const { submitJob, jobId, isLoading, error, resetJob } = useJobRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location) {
      setMessage(`❌ ${tMsg("required")}`);
      return;
    }

    try {
      // 작업 생성 API 호출
      await submitJob("EQUIPMENT_CREATE", {
        name,
        location,
        isActive,
      });
      setMessage(`✅ ${tMsg("jobCreated")}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : tMsg("unknownError");
      setMessage(`❌ ${tMsg("jobCreateFailed", { message: errorMessage })}`);
    }
  };

  const handleJobComplete = (result: JsonObject) => {
    const equipmentId = typeof result.equipmentId === 'string' ? result.equipmentId : undefined;
    setMessage(`✅ ${tMsg("completed", { id: equipmentId || name })}`);
    // 작업 ID 리셋하여 폼 활성화
    resetJob();
    // 폼 초기화
    setName("");
    setLocation("");
    setIsActive(true);
  };

  const handleJobError = (error: string) => {
    setMessage(`❌ ${tMsg("jobFailed", { error })}`);
    // 에러 발생 시에도 작업 ID 리셋하여 폼 활성화
    resetJob();
  };

  const isDisabled = isLoading || !!jobId;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader 
          title={t("title")}
          description={t("description")}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormSection>
              <FormGroup columns={1} className="pb-0">
                <FormField>
                  <Label htmlFor="name" required>{tFields("name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={tFields("namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isDisabled}
                    required={name.length === 0}
                    autoFocus
                  />
                </FormField>

                <FormField>
                  <Label htmlFor="location" required>{tFields("location")}</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder={tFields("locationPlaceholder")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isDisabled}
                    required={location.length === 0}
                  />
                </FormField>

                <FormField>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      disabled={isDisabled}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {tFields("isActiveLabel")}
                    </Label>
                  </div>
                </FormField>
              </FormGroup>
            </FormSection>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="submit"
                disabled={isDisabled || !name || !location}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tJob("creating")}
                  </>
                ) : jobId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tJob("processing")}
                  </>
                ) : (
                  t("actions.submit")
                )}
              </Button>
            </div>
          </form>

          {/* 메시지 표시 */}
          {message && (
            <Alert
              variant={message.includes("✅") ? "success" : "destructive"}
              className="mt-4"
            >
              {message}
            </Alert>
          )}

          {/* 작업 상태 표시 */}
          {jobId && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">{tJob("statusTitle")}</h3>
              <JobStatus
                jobId={jobId}
                onComplete={handleJobComplete}
                onError={handleJobError}
              />
            </div>
          )}

          {/* 에러 표시 */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

