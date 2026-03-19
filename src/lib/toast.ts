// lib/toast.ts
// react-toastify 기반 Toast 메시지 유틸리티 함수 모음
// 전역 위치에서 import하여 toast.success, toast.error 등을 간결하게 호출
// 메시지 출력 시 <ToastProvider />가 layout.tsx 등 전역에 주입되어 있어야 함

import { toast } from "react-toastify";

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);
export const showInfo = (message: string) => toast.info(message);
export const showWarn = (message: string) => toast.warn(message);