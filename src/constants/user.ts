export const STAT_CONFIG = [
  {
    label: "총 사용자",
    key: "total",
    color: "black",
  },
  {
    label: "활성 사용자",
    key: "active",
    color: "green",
  },
  {
    label: "비활성 사용자",
    key: "inactive",
    color: "red",
  },
  {
    label: "시스템 사용자",
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
  USER_REQUIRED_FIELDS: '필수 입력값을 모두 입력해주세요.',
  USER_CREATE_SUCCESS: '사용자가 성공적으로 생성되었습니다.',
  USER_UPDATE_SUCCESS: '사용자 정보가 성공적으로 수정되었습니다.',
  USER_DELETE_SUCCESS: '사용자가 성공적으로 삭제되었습니다.',
  USER_TOGGLE_SUCCESS: '사용자 상태가 변경되었습니다.',
  EMAIL_DUPLICATE: '이미 존재하는 이메일입니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  ROLE_REQUIRED: '역할을 선택해주세요.',
  LOADING: '로딩 중...',
  ERROR_LOADING: '데이터 로딩 실패',
} as const;

export const USER_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  PASSWORD: 'password',
  ROLE: 'roleId',
  BIO: 'bio',
  PERMISSIONS: 'permissionIds',
} as const;
