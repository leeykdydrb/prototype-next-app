import type { FilterField } from "@/components/common/SearchFilter";
import type { RoleSearchFilters } from "@/types/role";

export const STAT_CONFIG = [
  {
    label: "총 역할",
    key: "total",
    color: "black",
  },
  {
    label: "활성 역할",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 역할",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 역할",
    key: "system",
    color: "blue",
  },
] as const;

export const FILTER_FIELDS = [
  {
    type: "search",
    key: "search",
    id: "role-search",
    placeholder: "역할명, 표시명, 설명으로 검색...",
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
] as const satisfies FilterField<RoleSearchFilters>[];

export const MESSAGES = {
  ROLE_REQUIRED_FIELDS: '필수 입력값을 모두 입력해주세요.',
  ROLE_CREATE_SUCCESS: '역할이 성공적으로 생성되었습니다.',
  ROLE_UPDATE_SUCCESS: '역할이 성공적으로 수정되었습니다.',
  ROLE_DELETE_SUCCESS: '역할이 성공적으로 삭제되었습니다.',
  ROLE_TOGGLE_SUCCESS: '역할 상태가 변경되었습니다.',
  LOADING: '로딩 중...',
  ERROR_LOADING: '데이터 로딩 실패',
} as const;