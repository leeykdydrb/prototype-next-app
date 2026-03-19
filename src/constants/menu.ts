import type { FilterField } from "@/components/common/SearchFilter";
import type { MenuSearchFilters } from "@/types/menu";

export const STAT_CONFIG = [
  {
    label: "총 메뉴",
    key: "total",
    color: "black",
  },
  {
    label: "활성 메뉴",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 메뉴",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 메뉴",
    key: "system",
    color: "blue",
  },
] as const;

export const FILTER_FIELDS = [
  {
    type: "search",
    key: "search",
    id: "menu-search",
    placeholder: "메뉴명, 경로명으로 검색...",
  },
  {
    type: "select",
    key: "isActive",
    label: "상태",
    options: [
      { value: "all", label: "전체" },
      { value: "true", label: "활성" },
      { value: "false", label: "비활성" },
    ],
  },
] as const satisfies FilterField<MenuSearchFilters>[];

export const MESSAGES = {
  MENU_REQUIRED_FIELDS: '필수 입력값을 모두 입력해주세요.',
  MENU_CREATE_SUCCESS: '메뉴가 성공적으로 생성되었습니다.',
  MENU_UPDATE_SUCCESS: '메뉴가 성공적으로 수정되었습니다.',
  MENU_DELETE_SUCCESS: '메뉴가 성공적으로 삭제되었습니다.',
  MENU_TOGGLE_SUCCESS: '메뉴 상태가 변경되었습니다.',
  LOADING: '로딩 중...',
  ERROR_LOADING: '데이터 로딩 실패',
} as const;

export const MENU_ICONS = [
  "Dashboard",
  "Engineering",
  "Assessment",
  "People",
  "Settings",
  "SystemSettings",
  "Security",
  "Groups",
  "Menu",
]as const;