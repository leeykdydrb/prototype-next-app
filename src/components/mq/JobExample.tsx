'use client';

import { useState } from 'react';
import { useJobRequest, JobStatus, JsonObject } from './JobStatus';

/**
 * 작업 요청 예시 컴포넌트
 * 
 * 사용자가 버튼을 클릭하면:
 * 1. 작업 요청 → API 호출
 * 2. 작업 ID 받음 → 스피너 표시
 * 3. 폴링으로 상태 확인
 * 4. 완료 시 결과 표시
 */
export function JobExample() {
  const { submitJob, jobId, isLoading, error } = useJobRequest();
  const [result, setResult] = useState<JsonObject | null>(null);

  const handleCreateEquipment = async () => {
    try {
      await submitJob('EQUIPMENT_CREATE', {
        name: 'New Equipment',
        location: 'Factory A',
      });
    } catch (err) {
      console.error('Failed to submit job:', err);
    }
  };

  const handleExportData = async () => {
    try {
      await submitJob('DATA_EXPORT', {
        format: 'csv',
        dateRange: { start: '2024-01-01', end: '2024-12-31' },
      });
    } catch (err) {
      console.error('Failed to submit job:', err);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">작업 요청 예시</h2>

      {/* 작업 요청 버튼들 */}
      <div className="flex gap-2">
        <button
          onClick={handleCreateEquipment}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? '요청 중...' : '설비 생성 작업 요청'}
        </button>

        <button
          onClick={handleExportData}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? '요청 중...' : '데이터 내보내기 작업 요청'}
        </button>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 작업 상태 표시 */}
      {jobId && (
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">작업 ID: {jobId}</h3>
          <JobStatus
            jobId={jobId}
            onComplete={(result) => {
              setResult(result);
              console.log('작업 완료:', result);
            }}
            onError={(error) => {
              console.error('작업 실패:', error);
            }}
          />
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-semibold mb-2">작업 결과:</h3>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


