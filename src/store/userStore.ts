// store/userStore.ts
// 사용자 전역 상태 저장소 (Zustand 기반)
// - 로그인한 사용자의 ID, 이름, 역할(role)을 저장 및 관리
// - 로그인/로그아웃 시 상태 갱신에 사용됨
// - useSessionUser 훅과 함께 연동됨

import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

interface UserStore {
  user: User | null; // 현재 사용자 정보 (로그인 안된 경우 null)
  setUser: (user: User) => void; // 사용자 정보 설정
  clearUser: () => void; // 사용자 정보 초기화 (로그아웃 등)
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }), // 사용자 정보 저장
  clearUser: () => set({ user: null }), // 사용자 정보 초기화
}));
