'use client';

import { useState, useEffect } from 'react';

// JSON 값 타입 정의 (재귀적)
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

interface JobStatus {
  jobId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  result?: JsonObject;
  error?: string;
}

interface JobStatusProps {
  jobId: string;
  onComplete?: (result: JsonObject) => void;
  onError?: (error: string) => void;
}

/**
 * 작업 상태를 폴링으로 확인하는 컴포넌트
 * 
 * 사용 예시:
 * <JobStatus 
 *   jobId={jobId} 
 *   onComplete={(result) => console.log('완료:', result)}
 *   onError={(error) => console.error('에러:', error)}
 * />
 */
export function JobStatus({ jobId, onComplete, onError }: JobStatusProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!jobId || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/jobs?jobId=${jobId}`);
        const data = await response.json();

        setJobStatus(data);

        // 작업 완료 또는 실패 시 폴링 중지
        if (data.status === 'COMPLETED') {
          setIsPolling(false);
          onComplete?.(data.result);
        } else if (data.status === 'FAILED') {
          setIsPolling(false);
          onError?.(data.error || '작업 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('Error polling job status:', error);
      }
    }, 2000); // 1초마다 폴링

    return () => clearInterval(pollInterval);
  }, [jobId, isPolling, onComplete, onError]);

  if (!jobStatus) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span>작업 상태 확인 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 상태 표시 */}
      <div className="flex items-center gap-2">
        {jobStatus.status === 'PROCESSING' && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
        {jobStatus.status === 'COMPLETED' && (
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
        )}
        {jobStatus.status === 'FAILED' && (
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
        )}
        <span className="font-medium">
          {jobStatus.status === 'PENDING' && '대기 중'}
          {jobStatus.status === 'PROCESSING' && '처리 중'}
          {jobStatus.status === 'COMPLETED' && '완료'}
          {jobStatus.status === 'FAILED' && '실패'}
        </span>
      </div>

      {/* 진행률 표시 */}
      {jobStatus.status === 'PROCESSING' && jobStatus.progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${jobStatus.progress}%` }}
          ></div>
        </div>
      )}

      {/* 에러 메시지 */}
      {jobStatus.status === 'FAILED' && jobStatus.error && (
        <div className="text-red-600 text-sm">{jobStatus.error}</div>
      )}

      {/* 완료 메시지 */}
      {jobStatus.status === 'COMPLETED' && (
        <div className="text-green-600 text-sm">작업이 성공적으로 완료되었습니다.</div>
      )}
    </div>
  );
}

/**
 * 작업 요청 훅
 */
export function useJobRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitJob = async (type: string, data: JsonObject) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '작업 요청 실패');
      }

      setJobId(result.jobId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetJob = () => {
    setJobId(null);
    setError(null);
  };

  return {
    submitJob,
    jobId,
    isLoading,
    error,
    resetJob,
  };
}


