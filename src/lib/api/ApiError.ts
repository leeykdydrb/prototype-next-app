// lib/api/ApiError.ts
// API 요청 중 발생할 수 있는 예외 상황을 처리하기 위한 커스텀 Error 클래스
// - API Route 또는 Fetch wrapper (예: apiClient.ts) 내에서 사용
// - HTTP status 코드와 success 플래그를 함께 포함하여 에러 응답을 표준화

export class ApiError extends Error {
  status: number; // HTTP 상태 코드 (예: 400, 401, 500 등)
  success: boolean; // API 실패 응답 명시 (항상 false)

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.success = false;
  }
}