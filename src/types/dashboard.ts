export interface DashboardData {
  id: number;
  boardName: string;
  notice: string;
  role?: "admin" | "user" | string; // 실무에 따라 구체화 가능
}
