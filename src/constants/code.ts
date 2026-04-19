export type CodeGroupStatKey = "total" | "active" | "inactive" | "system";
export const CODE_GROUP_STAT_CONFIG = [
  { key: "total", color: "black" },
  { key: "active", color: "green" },
  { key: "inactive", color: "red" },
  { key: "system", color: "blue" },
] as const satisfies { key: CodeGroupStatKey; color: string }[];

export type CodeStatKey = "total" | "active" | "inactive" | "system";
export const CODE_STAT_CONFIG = [
  { key: "total", color: "black" },
  { key: "active", color: "green" },
  { key: "inactive", color: "red" },
  { key: "system", color: "blue" },
] as const satisfies { key: CodeStatKey; color: string }[];

// 기본 페이지네이션
export const DEFAULT_ROWS_PER_PAGE = 10;