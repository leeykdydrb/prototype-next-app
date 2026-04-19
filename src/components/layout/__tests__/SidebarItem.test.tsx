/**
 * SidebarItem 컴포넌트 테스트 파일
 * 
 * SidebarItem 컴포넌트는 사이드바의 개별 메뉴 아이템을 담당합니다.
 * 이 테스트는 아이콘 매핑, 클릭 핸들러, 하위 메뉴 처리 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarItem from '../Sidebar/SidebarItem';
import { SidebarProvider } from '@/components/framework/layout';
import type { MenuTree } from '@/types/menu';

// useRouter와 usePathname 모킹
const mockPush = vi.fn();
const mockUsePathname = vi.fn(() => '/dashboard');

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/hooks/menu/useNavMenuTitle", () => ({
  useNavMenuTitle: () => (menu: { title: string }) => menu.title,
}));

describe('SidebarItem', () => {
  // 공통 mock 데이터
  const mockSingleMenuItem: MenuTree = {
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
  };

  const mockMenuItemWithChildren: MenuTree = {
    id: 2,
    title: 'Settings',
    titleKey: 'NavMenu.settings',
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/dashboard');
  });

  /**
   * SidebarItem이 단일 메뉴 아이템을 렌더링하고 활성/비활성 상태를 올바르게 표시하는지 테스트
   */
  it('should render single menu item and display active/inactive state correctly', () => {
    const { container, rerender } = render(
      <SidebarProvider>
        <SidebarItem item={mockSingleMenuItem} isActive={true} />
      </SidebarProvider>
    );
    
    expect(screen.getByText('Dashboard')).toBeDefined();
    const button = screen.getByText('Dashboard').closest('button');
    expect(button).toBeDefined();
    // 활성 상태 확인
    expect(button?.getAttribute('data-active')).toBe('true');
    // 아이콘 렌더링 확인
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();

    // 비활성 상태 테스트
    rerender(
      <SidebarProvider>
        <SidebarItem item={mockSingleMenuItem} isActive={false} />
      </SidebarProvider>
    );
    const inactiveButton = screen.getByText('Dashboard').closest('button');
    expect(inactiveButton?.getAttribute('data-active')).toBe('false');
  });

  /**
   * SidebarItem이 알 수 없는 아이콘에 대해 기본 아이콘을 표시하는지 테스트
   */
  it('should display default icon for unknown icon', () => {
    const menuItem: MenuTree = {
      id: 1,
      title: 'Unknown',
      titleKey: 'NavMenu.unknown',
      path: '/unknown',
      icon: 'UnknownIcon',
      order: 1,
      parentId: null,
      isActive: true,
      isSystem: false,
      permissionIds: [],
      children: [],
    };

    const { container } = render(
      <SidebarProvider>
        <SidebarItem item={menuItem} isActive={false} />
      </SidebarProvider>
    );
    const defaultIcon = container.querySelector('.bg-gray-400');
    expect(defaultIcon).toBeDefined();
  });

  /**
   * SidebarItem이 클릭 시 router.push를 호출하는지 테스트
   */
  it('should call router.push when clicked', async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <SidebarItem item={mockSingleMenuItem} isActive={false} />
      </SidebarProvider>
    );
    
    const button = screen.getByText('Dashboard').closest('button');
    expect(button).toBeDefined();
    
    await user.click(button!);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  /**
   * SidebarItem이 하위 메뉴가 있는 경우 Collapsible을 렌더링하고 클릭 시 열리는지 테스트
   */
  it('should render Collapsible when menu has children and open on click', async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <SidebarItem item={mockMenuItemWithChildren} isActive={false} />
      </SidebarProvider>
    );
    
    expect(screen.getByText('Settings')).toBeDefined();
    // 초기에는 하위 메뉴가 보이지 않아야 함
    expect(screen.queryByText('User Settings')).toBeNull();
    
    const trigger = screen.getByText('Settings').closest('button');
    expect(trigger).toBeDefined();
    
    await user.click(trigger!);
    await waitFor(() => {
      expect(screen.getByText('User Settings')).toBeDefined();
    });
  });

  /**
   * SidebarItem이 부모 메뉴가 활성 상태일 때 자동으로 열리는지 테스트
   */
  it('should auto-open when parent is active', () => {
    mockUsePathname.mockReturnValue('/settings/user');

    render(
      <SidebarProvider>
        <SidebarItem item={mockMenuItemWithChildren} isActive={false} />
      </SidebarProvider>
    );
    expect(screen.getByText('User Settings')).toBeDefined();
  });

  /**
   * SidebarItem이 하위 메뉴 클릭 시 router.push를 호출하는지 테스트
   */
  it('should call router.push when child menu is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <SidebarItem item={mockMenuItemWithChildren} isActive={false} />
      </SidebarProvider>
    );
    
    const trigger = screen.getByText('Settings').closest('button');
    expect(trigger).toBeDefined();
    
    await user.click(trigger!);
    
    // 하위 메뉴가 완전히 렌더링될 때까지 대기
    await waitFor(() => {
      expect(screen.getByText('User Settings')).toBeDefined();
    }, { timeout: 3000 });

    // SidebarMenuSubButton은 <a> 태그일 수 있으므로 직접 텍스트로 찾기
    const childButton = screen.getByText('User Settings');
    expect(childButton).toBeDefined();
    
    await user.click(childButton);
    
    // router.push가 호출될 때까지 대기
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/settings/user');
    }, { timeout: 3000 });
  });

  /**
   * SidebarItem이 path가 없는 메뉴를 처리하고 클릭 시 router.push가 호출되지 않는지 테스트
   */
  it('should handle menu item without path and not call router.push on click', async () => {
    const user = userEvent.setup();
    const menuItem: MenuTree = {
      id: 1,
      title: 'No Path',
      titleKey: 'NavMenu.noPath',
      path: null,
      icon: 'Dashboard',
      order: 1,
      parentId: null,
      isActive: true,
      isSystem: false,
      permissionIds: [],
      children: [],
    };

    render(
      <SidebarProvider>
        <SidebarItem item={menuItem} isActive={false} />
      </SidebarProvider>
    );
    
    expect(screen.getByText('No Path')).toBeDefined();
    
    const button = screen.getByText('No Path').closest('button');
    expect(button).toBeDefined();
    
    // path가 없으므로 클릭해도 router.push가 호출되지 않아야 함
    await user.click(button!);
    expect(mockPush).not.toHaveBeenCalled();
  });
});

