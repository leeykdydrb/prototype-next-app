"use client";

import { useState } from "react";
import { useJobRequest, JobStatus, JsonObject } from "@/components/mq/JobStatus";
import { Card, CardContent, CardHeader } from "@/components/framework/layout";
import { Button, FormField, FormGroup, FormSection, Input, Label, Switch } from "@/components/framework/form";
import { Alert } from "@/components/framework/feedback";
import { Loader2 } from "lucide-react";

export default function EquipmentCreateForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");

  const { submitJob, jobId, isLoading, error, resetJob } = useJobRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location) {
      setMessage("❌ 설비 이름과 위치를 입력해주세요.");
      return;
    }

    try {
      // 작업 생성 API 호출
      await submitJob("EQUIPMENT_CREATE", {
        name,
        location,
        isActive,
      });
      setMessage("✅ 작업이 생성되었습니다. 처리 중...");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
      setMessage(`❌ 작업 생성 실패: ${errorMessage}`);
    }
  };

  const handleJobComplete = (result: JsonObject) => {
    const equipmentId = typeof result.equipmentId === 'string' ? result.equipmentId : undefined;
    setMessage(`✅ 설비 등록 완료 설비ID: ${equipmentId || name}`);
    // 작업 ID 리셋하여 폼 활성화
    resetJob();
    // 폼 초기화
    setName("");
    setLocation("");
    setIsActive(true);
  };

  const handleJobError = (error: string) => {
    setMessage(`❌ 작업 처리 실패: ${error}`);
    // 에러 발생 시에도 작업 ID 리셋하여 폼 활성화
    resetJob();
  };

  const isDisabled = isLoading || !!jobId;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader 
          title="설비 등록" 
          description="새로운 설비를 등록합니다. 작업은 비동기로 처리됩니다."
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormSection>
              <FormGroup columns={1} className="pb-0">
                <FormField>
                  <Label htmlFor="name" required>설비 이름</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="설비 이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isDisabled}
                    required={name.length === 0}
                    autoFocus
                  />
                </FormField>

                <FormField>
                  <Label htmlFor="location" required>설비 위치</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="설비 위치를 입력하세요"
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
                      가동 중
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
                    작업 생성 중...
                  </>
                ) : jobId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "등록"
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
              <h3 className="text-lg font-semibold mb-4">작업 상태</h3>
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

