import { useMemo } from "react";
import type { CodeGroupData } from "@/types/code-group";

export const useCodeGroupStats = (codeGroups: CodeGroupData[]) => {
  return useMemo(() => {
    const total = codeGroups.length;
    const active = codeGroups.filter((group) => group.isActive).length;
    const inactive = codeGroups.filter((group) => !group.isActive).length;
    const system = codeGroups.filter((group) => group.isSystem).length;

    return {
      total,
      active,
      inactive,
      system,
    };
  }, [codeGroups]);
}; 