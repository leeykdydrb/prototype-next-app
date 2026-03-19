"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

// OAuth 에러 페이지
export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const [isRetrying, setIsRetrying] = useState(false);

  // Configuration 에러인 경우 (Keycloak 연결 실패 등)
  const isConfigurationError = error === "Configuration";

  // 수동 재시도만 허용 (무한 루프 방지)
  const handleRetry = () => {
    setIsRetrying(true);
    window.location.replace("/api/auth/signin/keycloak");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {isConfigurationError ? (
            <>
              <div className="mb-4">
                {isRetrying ? (
                  <svg
                    className="mx-auto h-12 w-12 text-yellow-500 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isRetrying ? "연결 중..." : "인증 서비스 연결 실패"}
              </h1>
              <p className="text-gray-600 mb-4">
                {isRetrying
                  ? message || "잠시 후 로그인 페이지로 이동합니다."
                  : message || "Keycloak 인증 서버에 연결할 수 없습니다."}
              </p>
              {!isRetrying && process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-left">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    개발 환경 안내:
                  </p>
                  <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                    <li>Keycloak 서버가 실행 중인지 확인하세요</li>
                    <li>
                      환경 변수 (KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID 등)가
                      올바르게 설정되었는지 확인하세요
                    </li>
                  </ul>
                </div>
              )}
              {!isRetrying && (
                <div className="mt-6">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-yellow-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                인증 처리 중...
              </h1>
              <p className="text-gray-500">
                잠시 후 로그인 페이지로 이동합니다.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
    )
  }