// hooks/dashboard/useDashboardQuery.ts
// 대시보드 데이터 조회 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["dashboard"] → 캐시 식별자 역할
// - URL: /api/dashboard
// - 필요 시 쿼리파라미터 (page, size 등)

import { useApiQuery } from "@/hooks/api/useApiQuery";
import type { DashboardData } from "@/types/dashboard";

export const useDashboardQuery = () =>
  useApiQuery<DashboardData[]>(["dashboard"], "/api/dashboard", 
    // { page: 1, size: 10 }
  );
