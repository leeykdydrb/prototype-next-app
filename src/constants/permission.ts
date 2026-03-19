export const STAT_CONFIG = [
  {
    label: "총 권한",
    key: "total",
    color: "black",
  },
  {
    label: "활성 권한",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 권한",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 권한",
    key: "system",
    color: "blue",
  },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "true", label: "활성" },
  { value: "false", label: "비활성" },
] as const;

export const MESSAGES = {
  PERMISSION_REQUIRED_FIELDS: '필수 입력값을 모두 입력해주세요.',
  PERMISSION_CREATE_SUCCESS: '권한이 성공적으로 생성되었습니다.',
  PERMISSION_UPDATE_SUCCESS: '권한이 성공적으로 수정되었습니다.',
  PERMISSION_DELETE_SUCCESS: '권한이 성공적으로 삭제되었습니다.',
  PERMISSION_TOGGLE_SUCCESS: '권한 상태가 변경되었습니다.',
  LOADING: '로딩 중...',
  ERROR_LOADING: '데이터 로딩 실패',
} as const;