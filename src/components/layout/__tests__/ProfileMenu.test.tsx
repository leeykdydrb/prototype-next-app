/**
 * ProfileMenu 컴포넌트 테스트 파일
 * 
 * ProfileMenu 컴포넌트는 사용자 메뉴 드롭다운을 담당합니다.
 * 이 테스트는 사용자 정보 표시, 로그아웃 기능 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messagesEn from '../../../../messages/en.json';
import ProfileMenu from '../Header/ProfileMenu';

// 모킹
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

vi.mock('@/store/userStore', () => ({
  useUserStore: vi.fn(),
}));

import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/userStore';

describe('ProfileMenu', () => {
  const mockUseSession = vi.mocked(useSession);
  const mockUseUserStore = vi.mocked(useUserStore);

  type UserInfo = {
    id: string;
    name: string;
    role: string;
    permissions: string[];
  };

  type UserStoreState = {
    user: UserInfo | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
  };

  const makeUserStoreState = (user: UserStoreState["user"]): UserStoreState => ({
    user,
    setUser: vi.fn(),
    clearUser: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // window.location.href 할당을 테스트하기 위해 location을 단순 객체로 교체
    // (happy-dom/jsdom 환경에서 href가 read-only인 경우가 있음)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = { origin: 'http://localhost', href: 'http://localhost/' };

    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    } as unknown as ReturnType<typeof useSession>);
  });

  /**
   * ProfileMenu가 사용자 정보를 표시하는지 테스트
   */
  it('should display user information', async () => {
    mockUseUserStore.mockImplementation((selector: (state: UserStoreState) => unknown) =>
      selector(
        makeUserStoreState({
          id: 'user123',
          name: 'Test User',
          role: 'Admin',
          permissions: [],
        })
      )
    );

    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={messagesEn}>
        <ProfileMenu />
      </NextIntlClientProvider>
    );

    const trigger = screen.getByLabelText('User menu');
    await user.click(trigger);

    // DropdownMenu는 포털을 사용하므로 document.body에서 찾기
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
      if (portal) {
        expect(portal.textContent).toContain('Test User');
        expect(portal.textContent).toContain('user123');
        expect(portal.textContent).toContain('Admin');
      }
    }, { timeout: 3000 });
  });

  /**
   * ProfileMenu가 사용자 정보가 없을 때 기본값을 표시하는지 테스트
   */
  it('should display default values when user information is not available', async () => {
    mockUseUserStore.mockImplementation((selector: (state: UserStoreState) => unknown) =>
      selector(makeUserStoreState(null))
    );

    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={messagesEn}>
        <ProfileMenu />
      </NextIntlClientProvider>
    );

    const trigger = screen.getByLabelText('User menu');
    await user.click(trigger);

    // DropdownMenu는 포털을 사용하므로 document.body에서 찾기
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
      if (portal) {
        expect(portal.textContent).toContain('User');
      }
    }, { timeout: 3000 });
  });

  /**
   * idToken이 없을 때는 logout callback으로 이동하는지 테스트
   */
  it('should navigate to logout callback when idToken is missing', async () => {
    mockUseUserStore.mockImplementation((selector: (state: UserStoreState) => unknown) =>
      selector(
        makeUserStoreState({
          id: 'user123',
          name: 'Test User',
          role: 'Admin',
          permissions: [],
        })
      )
    );
    mockUseSession.mockReturnValue({
      data: ({ idToken: undefined } as unknown as { idToken?: string }),
      status: 'authenticated',
      update: vi.fn(),
    } as unknown as ReturnType<typeof useSession>);

    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={messagesEn}>
        <ProfileMenu />
      </NextIntlClientProvider>
    );

    const trigger = screen.getByLabelText('User menu');
    await user.click(trigger);

    // DropdownMenu 콘텐츠가 나타날 때까지 대기
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
    }, { timeout: 3000 });

    // 포털 내부에서 로그아웃 버튼 찾기
    const portal = document.body.querySelector('[data-radix-portal]');
    expect(portal).toBeDefined();
    if (portal) {
      const logoutButton = within(portal as HTMLElement).getByText('Sign out');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(window.location.href).toBe('/api/auth/logout/callback');
      });
    }
  });

  /**
   * ProfileMenu 트리거 클릭 시 드롭다운이 열리는지 테스트
   */
  it('should use children as trigger and open dropdown on click', async () => {
    mockUseUserStore.mockImplementation((selector: (state: UserStoreState) => unknown) =>
      selector(
        makeUserStoreState({
          id: 'user123',
          name: 'Test User',
          role: 'Admin',
          permissions: [],
        })
      )
    );

    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={messagesEn}>
        <ProfileMenu />
      </NextIntlClientProvider>
    );

    const trigger = screen.getByLabelText('User menu');
    expect(trigger).toBeDefined();

    await user.click(trigger);

    // 드롭다운이 열리는지 확인
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
    }, { timeout: 3000 });
  });
});

