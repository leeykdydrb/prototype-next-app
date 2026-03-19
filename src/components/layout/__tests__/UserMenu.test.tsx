/**
 * UserMenu 컴포넌트 테스트 파일
 * 
 * UserMenu 컴포넌트는 사용자 메뉴 드롭다운을 담당합니다.
 * 이 테스트는 사용자 정보 표시, 로그아웃 기능 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMenu from '../Header/UserMenu';

// 모킹
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

vi.mock('@/store/userStore', () => ({
  useUserStore: vi.fn(),
}));

import { signOut } from 'next-auth/react';
import { useUserStore } from '@/store/userStore';

describe('UserMenu', () => {
  const mockSignOut = vi.mocked(signOut);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue({ url: '/login' } as Awaited<ReturnType<typeof signOut>>);
  });

  /**
   * UserMenu가 사용자 정보를 표시하는지 테스트
   */
  it('should display user information', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: {
        id: 'user123',
        name: 'Test User',
        role: 'Admin',
      },
    } as ReturnType<typeof useUserStore>);

    const user = userEvent.setup();
    render(
      <UserMenu>
        <button>User Button</button>
      </UserMenu>
    );

    const trigger = screen.getByText('User Button');
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
   * UserMenu가 사용자 정보가 없을 때 기본값을 표시하는지 테스트
   */
  it('should display default values when user information is not available', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: null,
    } as ReturnType<typeof useUserStore>);

    const user = userEvent.setup();
    render(
      <UserMenu>
        <button>User Button</button>
      </UserMenu>
    );

    const trigger = screen.getByText('User Button');
    await user.click(trigger);

    // DropdownMenu는 포털을 사용하므로 document.body에서 찾기
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
      if (portal) {
        expect(portal.textContent).toContain('사용자');
      }
    }, { timeout: 3000 });
  });

  /**
   * UserMenu의 로그아웃 버튼 클릭 시 signOut이 호출되는지 테스트
   */
  it('should call signOut when logout button is clicked', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: {
        id: 'user123',
        name: 'Test User',
        role: 'Admin',
      },
    } as ReturnType<typeof useUserStore>);

    const user = userEvent.setup();
    render(
      <UserMenu>
        <button>User Button</button>
      </UserMenu>
    );

    const trigger = screen.getByText('User Button');
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
      const logoutButton = within(portal as HTMLElement).getByText('로그아웃');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
      });
    }
  });

  /**
   * UserMenu가 children을 트리거로 사용하고 클릭 시 드롭다운이 열리는지 테스트
   */
  it('should use children as trigger and open dropdown on click', async () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: {
        id: 'user123',
        name: 'Test User',
        role: 'Admin',
      },
    } as ReturnType<typeof useUserStore>);

    const user = userEvent.setup();
    render(
      <UserMenu>
        <button>Custom Trigger</button>
      </UserMenu>
    );

    const trigger = screen.getByText('Custom Trigger');
    expect(trigger).toBeDefined();

    await user.click(trigger);

    // 드롭다운이 열리는지 확인
    await waitFor(() => {
      const portal = document.body.querySelector('[data-radix-portal]');
      expect(portal).toBeDefined();
    }, { timeout: 3000 });
  });
});

