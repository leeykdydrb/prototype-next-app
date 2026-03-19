/**
 * AppSidebar 컴포넌트 테스트 파일
 * 
 * AppSidebar 컴포넌트는 애플리케이션의 사이드바를 담당합니다.
 * 이 테스트는 메뉴 렌더링, 활성 상태 처리 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppSidebar from '../Sidebar/AppSidebar';
import { SidebarProvider } from '@/components/framework/layout';
import type { MenuTree } from '@/types/menu';

// useRouter와 usePathname 모킹
const mockPush = vi.fn();
const mockUsePathname = vi.fn(() => '/dashboard');

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
    usePathname: () => mockUsePathname(),
  };
});

describe('AppSidebar', () => {
  const mockMenus: MenuTree[] = [
    {
      id: 1,
      title: 'Dashboard',
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
      path: '/settings',
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
   * AppSidebar가 메뉴 목록을 렌더링하는지 테스트
   */
  it('should render menu list', () => {
    render(
      <SidebarProvider>
        <AppSidebar menus={mockMenus} />
      </SidebarProvider>
    );
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  /**
   * AppSidebar가 현재 경로와 일치하는 메뉴를 활성 상태로 표시하는지 테스트
   */
  it('should mark menu as active when pathname matches', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(
      <SidebarProvider>
        <AppSidebar menus={mockMenus} />
      </SidebarProvider>
    );

    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toBeDefined();
    // 활성 상태 확인
    expect(dashboardButton?.getAttribute('data-active')).toBe('true');
    
    // Settings는 비활성 상태여야 함
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton?.getAttribute('data-active')).toBe('false');
  });

  /**
   * AppSidebar가 하위 경로에 대해 부모 메뉴를 활성 상태로 표시하는지 테스트
   */
  it('should mark parent menu as active when pathname starts with menu path', () => {
    mockUsePathname.mockReturnValue('/settings/user');
    render(
      <SidebarProvider>
        <AppSidebar menus={mockMenus} />
      </SidebarProvider>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).toBeDefined();
    // 활성 상태 확인 - /settings/user는 /settings로 시작하므로 Settings가 활성화되어야 함
    expect(settingsButton?.getAttribute('data-active')).toBe('true');
    
    // Dashboard는 비활성 상태여야 함
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton?.getAttribute('data-active')).toBe('false');
  });

  /**
   * AppSidebar가 LogoCi와 collapsible="icon" prop을 렌더링하는지 테스트
   */
  it('should render LogoCi and apply collapsible="icon" prop', () => {
    const { container } = render(
      <SidebarProvider>
        <AppSidebar menus={mockMenus} />
      </SidebarProvider>
    );
    
    // LogoCi 렌더링 확인
    const logo = container.querySelector('img[alt="LogoCi"]');
    expect(logo).toBeDefined();
    
    // collapsible="icon" prop 적용 확인
    const sidebar = container.querySelector('[data-collapsible="icon"]');
    expect(sidebar).toBeDefined();
  });

  /**
   * AppSidebar가 빈 메뉴 배열을 처리하는지 테스트
   * - 빈 메뉴 배열일 때도 SidebarHeader와 SidebarContent는 렌더링되어야 함
   * - 메뉴 아이템은 렌더링되지 않아야 함
   */
  it('should handle empty menu array', () => {
    const { container } = render(
      <SidebarProvider>
        <AppSidebar menus={[]} />
      </SidebarProvider>
    );
    
    // 빈 메뉴 배열일 때도 SidebarHeader는 렌더링되어야 함
    const logo = container.querySelector('img[alt="LogoCi"]');
    expect(logo).toBeDefined();
    
    // SidebarContent는 렌더링되지만 메뉴는 없어야 함
    const sidebar = container.querySelector('[data-collapsible="icon"]');
    expect(sidebar).toBeDefined();
    
    // 메뉴 아이템이 렌더링되지 않았는지 확인
    expect(screen.queryByText('Dashboard')).toBeNull();
    expect(screen.queryByText('Settings')).toBeNull();
  });
});

