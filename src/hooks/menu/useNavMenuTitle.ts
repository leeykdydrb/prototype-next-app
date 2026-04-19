"use client";

import type { MenuData } from "@/types/menu";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

/**
 * DB 메뉴 `title`은 기본(예: 관리자 화면용 한글)로 두고,
 * `messages`의 `titleKey`가 있으면 현재 로케일 문구를 씁니다.
 * 키가 없으면 DB `title` 그대로 표시합니다.
 */
export function useNavMenuTitle() {
  const t = useTranslations();

  return useCallback(
    (menu: Pick<MenuData, "titleKey" | "title">) => {
      const key = menu.titleKey;
      if (key && t.has(key)) return t(key);
      return menu.title;
    },
    [t]
  );
}
