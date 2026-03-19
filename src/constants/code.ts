import type { FilterField } from "@/components/common/SearchFilter";
import type { CodeGroupSearchFilters } from "@/types/code-group";
import type { CodeSearchFilters } from "@/types/code";

export const MESSAGES = {
  // 로딩 및 에러
  LOADING: '코드를 불러오는 중...',
  ERROR_LOADING: '코드를 불러오는데 실패했습니다.',

  REQUIRED_FIELDS: '필수 입력값을 모두 입력해주세요.',
  // 코드 그룹
  CODE_GROUP_CREATE_SUCCESS: '코드 그룹이 생성되었습니다.',
  CODE_GROUP_UPDATE_SUCCESS: '코드 그룹이 수정되었습니다.',
  CODE_GROUP_DELETE_SUCCESS: '코드 그룹이 삭제되었습니다.',
  CODE_GROUP_TOGGLE_SUCCESS: '코드 그룹 상태가 변경되었습니다.',
  CODE_GROUP_DELETE_CONFIRM: '이 코드 그룹을 삭제하시겠습니까?\n그룹에 속한 모든 코드도 함께 삭제됩니다.',
  CODE_GROUP_SYSTEM_DELETE_ERROR: '시스템 코드 그룹은 삭제할 수 없습니다.',

  // 코드
  CODE_CREATE_SUCCESS: '코드가 생성되었습니다.',
  CODE_UPDATE_SUCCESS: '코드가 수정되었습니다.',
  CODE_DELETE_SUCCESS: '코드가 삭제되었습니다.',
  CODE_TOGGLE_SUCCESS: '코드 상태가 변경되었습니다.',
  CODE_DELETE_CONFIRM: '이 코드를 삭제하시겠습니까?',
  CODE_SYSTEM_DELETE_ERROR: '시스템 코드는 삭제할 수 없습니다.',

  // 검증
  CODE_GROUP_CODE_REQUIRED: '그룹 코드를 입력해주세요.',
  CODE_GROUP_NAME_REQUIRED: '그룹명을 입력해주세요.',
  CODE_CODE_REQUIRED: '코드를 입력해주세요.',
  CODE_NAME_REQUIRED: '코드명을 입력해주세요.',
  CODE_GROUP_REQUIRED: '코드 그룹을 선택해주세요.',
};

export const CODE_GROUP_STAT_CONFIG = [
  {
    label: "전체 그룹",
    key: "total",
    color: "black",
  },
  {
    label: "활성 그룹",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 그룹",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 그룹",
    key: "system",
    color: "blue",
  },
] as const;

export const CODE_STAT_CONFIG = [
   {
    label: "전체 코드",
    key: "total",
    color: "black",
  },
  {
    label: "활성 코드",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 코드",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 코드",
    key: "system",
    color: "blue",
  },
] as const;

// 필터 필드 설정
export const CODE_GROUP_FILTER_FIELDS = [
  {
    type: "search",
    key: "search",
    id: "code-group-search",
    placeholder: "그룹, 그룹명으로 검색...",
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
] as const satisfies FilterField<CodeGroupSearchFilters>[];

export const CODE_FILTER_FIELDS = [
  {
    type: "search",
    key: "search",
    id: "code-search",
    placeholder: '코드 또는 코드명으로 검색...',
  },
  {
    type: "select",
    key: "isActive",
    label: "상태",
    options: [
      { value: 'all', label: '전체' },
      { value: 'true', label: '활성' },
      { value: 'false', label: '비활성' },
    ],
  },
]as const satisfies FilterField<CodeSearchFilters>[];;

// 탭 설정
export const CODE_TABS = {
  GROUP: 'group',
  CODE: 'code',
} as const;

export const CODE_TAB_LABELS = {
  [CODE_TABS.GROUP]: '코드 그룹',
  [CODE_TABS.CODE]: '코드',
};

// 기본 페이지네이션
export const DEFAULT_ROWS_PER_PAGE = 10;
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50]; 