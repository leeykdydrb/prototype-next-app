/**
 * Layout 컴포넌트 테스트 파일
 * 
 * AppLayout 컴포넌트는 애플리케이션의 메인 레이아웃을 담당합니다.
 * 이 테스트는 메뉴 로딩, 에러 처리, 레이아웃 렌더링 등을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppLayout from '../AppLayout';

// 모킹
vi.mock('@/hooks/menu/useMenuQuery', () => ({
  useMenuQuery: vi.fn(),
}));

vi.mock('@/store/menuStore', () => ({
  useMenuStore: vi.fn(),
}));

vi.mock('@/utils/buildMenuTree', () => ({
  buildMenuTree: vi.fn((menus) => menus),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'loading' ? '로딩중...' : key,
}));

vi.mock('@/components/layout/Header/AppHeader', () => ({
  default: ({ title }: { title?: string }) => (
    <header data-testid="app-header">{title}</header>
  ),
}));

vi.mock('@/components/layout/Sidebar/AppSidebar', () => ({
  default: () => <aside data-testid="app-sidebar" />,
}));

import { useMenuQuery } from '@/hooks/menu/useMenuQuery';
import { useMenuStore } from '@/store/menuStore';
import { buildMenuTree } from '@/utils/buildMenuTree';

describe('AppLayout', () => {
  const mockSetMenus = vi.fn();
  const mockMenus = [
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMenuStore).mockReturnValue({
      setMenus: mockSetMenus,
    } as ReturnType<typeof useMenuStore>);
    vi.mocked(buildMenuTree).mockImplementation((menus) => menus);
  });

  /**
   * AppLayout이 로딩 중일 때 Loading 컴포넌트를 렌더링하는지 테스트
   */
  it('should render Loading when isLoading is true', () => {
    vi.mocked(useMenuQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as Partial<ReturnType<typeof useMenuQuery>> as ReturnType<typeof useMenuQuery>);

    render(<AppLayout>Test Content</AppLayout>);
    expect(screen.getByText('로딩중...')).toBeDefined();
  });

  /**
   * AppLayout이 에러 발생 시 ErrorMessage 컴포넌트를 렌더링하는지 테스트
   */
  it('should render ErrorMessage when error occurs', () => {
    const errorMessage = 'Failed to load menus';
    vi.mocked(useMenuQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: errorMessage },
    } as Partial<ReturnType<typeof useMenuQuery>> as ReturnType<typeof useMenuQuery>);

    render(<AppLayout>Test Content</AppLayout>);
    expect(screen.getByText(errorMessage)).toBeDefined();
  });

  /**
   * AppLayout이 메뉴 데이터를 성공적으로 로드하고 레이아웃을 렌더링하는지 테스트
   * - 메뉴 데이터 로드, children 렌더링, 헤더 타이틀 표시를 통합 테스트
   */
  it('should render layout with menus when data is loaded', async () => {
    vi.mocked(useMenuQuery).mockReturnValue({
      data: mockMenus,
      isLoading: false,
      error: null,
    } as Partial<ReturnType<typeof useMenuQuery>> as ReturnType<typeof useMenuQuery>);

    render(<AppLayout>Test Content</AppLayout>);

    await waitFor(() => {
      expect(mockSetMenus).toHaveBeenCalledWith(mockMenus);
    });

    expect(screen.getByText('Test Content')).toBeDefined();
    expect(screen.getByText('MICUBE SOLUTION SYSTEM')).toBeDefined();
  });

  /**
   * AppLayout이 빈 메뉴 데이터를 처리하는지 테스트
   */
  it('should handle empty menu data', async () => {
    vi.mocked(useMenuQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as Partial<ReturnType<typeof useMenuQuery>> as ReturnType<typeof useMenuQuery>);

    render(<AppLayout>Test Content</AppLayout>);

    await waitFor(() => {
      expect(mockSetMenus).toHaveBeenCalledWith([]);
    });

    expect(screen.getByText('Test Content')).toBeDefined();
  });
});

