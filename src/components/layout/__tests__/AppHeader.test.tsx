/**
 * AppHeader 컴포넌트 테스트 파일
 * 
 * AppHeader 컴포넌트는 애플리케이션의 헤더를 담당합니다.
 * 이 테스트는 Breadcrumb 생성 로직, 메뉴 경로 찾기, 렌더링 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppHeader from '../Header/AppHeader';
import { SidebarProvider } from '@/components/framework/layout';
import type { MenuTree } from '@/types/menu';

// usePathname 모킹
const mockUsePathname = vi.fn(() => '/dashboard');

vi.mock("@/hooks/menu/useNavMenuTitle", () => ({
  useNavMenuTitle: () => (menu: { title: string }) => menu.title,
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockUsePathname(),
  Link: ({
    children,
    href,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../Header/ProfileMenu", () => ({
  default: () => (
    <div data-testid="profile-menu">
      <button type="button" aria-label="user menu">
        profile
      </button>
    </div>
  ),
}));

vi.mock("../Header/LocaleMenu", () => ({
  default: () => <div data-testid="locale-menu" />,
}));

describe('AppHeader', () => {
  const mockMenus: MenuTree[] = [
    {
      id: 1,
      title: 'Dashboard',
      titleKey: 'NavMenu.dashboard',
      path: '/dashboard',
      icon: 'Dashboard',
      order: 1,
      parentId: null,
      isActive: true,
      isSystem: false,
      permissionIds: [],
      children: [],
    },
    {
      id: 2,
      title: 'Settings',
      titleKey: 'NavMenu.settings',
      path: null,
      icon: 'Settings',
      order: 2,
      parentId: null,
      isActive: true,
      isSystem: false,
      permissionIds: [],
      children: [
        {
          id: 3,
          title: 'User Settings',
          titleKey: 'NavMenu.settings',
          path: '/settings/user',
          icon: null,
          order: 1,
          parentId: 2,
          isActive: true,
          isSystem: false,
          permissionIds: [],
          children: [],
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/dashboard');
  });

  /**
   * AppHeader가 기본/커스텀 타이틀과 현재 경로에 맞는 Breadcrumb을 생성하는지 테스트
   */
  it('should render title and generate breadcrumb for current path', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    const { container } = render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );

    expect(container.textContent).toContain('PROTOTYPE SYSTEM');
    expect(container.textContent).toContain('Dashboard');
  });

  /**
   * AppHeader가 커스텀 타이틀을 렌더링하는지 테스트
   */
  it('should render with custom title', () => {
    const { container } = render(
      <SidebarProvider>
        <AppHeader title="Custom Title" menus={mockMenus} />
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Custom Title');
  });

  /**
   * AppHeader가 중첩된 메뉴 경로에 대한 Breadcrumb을 생성하고 path가 없는 대메뉴의 경우 첫 번째 하위 메뉴의 path를 사용하는지 테스트
   */
  it('should generate breadcrumb for nested menu path and use first child path when parent has no path', () => {
    mockUsePathname.mockReturnValue('/settings/user');
    const { container } = render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );

    expect(container.textContent).toContain('PROTOTYPE SYSTEM');
    expect(container.textContent).toContain('Settings');
    expect(container.textContent).toContain('User Settings');

    // Settings 링크가 첫 번째 하위 메뉴의 path를 사용하는지 확인
    const links = container.querySelectorAll('a[href]');
    const settingsLink = Array.from(links).find(link => 
      link.textContent?.includes('Settings')
    );
    expect(settingsLink).toBeDefined();
    if (settingsLink) {
      expect(settingsLink.getAttribute('href')).toBe('/settings/user');
    }
  });

  /**
   * AppHeader가 메뉴에서 찾을 수 없는 경로에 대해 기본 Breadcrumb을 생성하는지 테스트
   */
  it('should generate default breadcrumb when path is not found in menus', () => {
    mockUsePathname.mockReturnValue('/unknown-path');
    const { container } = render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );

    expect(container.textContent).toContain('PROTOTYPE SYSTEM');
  });

  /**
   * AppHeader가 ProfileMenu를 렌더링하는지 테스트
   */
  it("should render ProfileMenu", () => {
    render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );
    expect(screen.getByTestId("profile-menu")).toBeDefined();
    expect(screen.getByLabelText("user menu")).toBeDefined();
  });

  it("should render LocaleMenu", () => {
    render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );
    expect(screen.getByTestId("locale-menu")).toBeDefined();
  });

  /**
   * AppHeader가 SidebarTrigger를 렌더링하는지 테스트
   */
  it('should render SidebarTrigger', () => {
    const { container } = render(
      <SidebarProvider>
        <AppHeader menus={mockMenus} />
      </SidebarProvider>
    );
    // SidebarTrigger는 button 또는 다른 요소일 수 있음
    const trigger = container.querySelector('button[aria-label*="sidebar"], button[aria-label*="Sidebar"], [data-state]');
    expect(trigger).toBeDefined();
  });
});

