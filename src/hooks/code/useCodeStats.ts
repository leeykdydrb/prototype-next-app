import { useMemo } from "react";
import type { CodeData } from "@/types/code";

export const useCodeStats = (codes: CodeData[]) => {
  return useMemo(() => {
    const total = codes.length;
    const active = codes.filter((code) => code.isActive).length;
    const inactive = codes.filter((code) => !code.isActive).length;
    const system = codes.filter((code) => code.isSystem).length;

    return {
      total,
      active,
      inactive,
      system,
    };
  }, [codes]);
}; 