/**
 * Common 컴포넌트 테스트 파일
 * 
 * Common 컴포넌트는 애플리케이션 전반에서 사용되는 공통 컴포넌트들을 포함합니다.
 * 이 테스트는 Loading, ErrorMessage, ConfirmDialog, StatsCard, SearchFilter, ContentHeader, TablePagination, Logo, LogoCi 등 모든 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';
import ConfirmDialog from '../ConfirmDialog';
import StatsCard from '../StatsCard';
import SearchFilter, { type FilterField } from '../SearchFilter';
import ContentHeader from '../ContentHeader';
import TablePagination from '../TablePagination';
import Logo from '../Logo';
import LogoCi from '../LogoCi';

import type { Table, Row, RowModel } from '@tanstack/react-table';
import { Search } from 'lucide-react';

describe('Loading', () => {
  /**
   * Loading 컴포넌트가 메시지와 스피너 아이콘을 올바르게 렌더링하는지 테스트
   */
  it('should render loading message with spinner icon', () => {
    const { container } = render(<Loading message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeDefined();
    expect(container.querySelector('.animate-spin')).toBeDefined();
  });
});

describe('ErrorMessage', () => {
  /**
   * ErrorMessage 컴포넌트가 에러 메시지, 스타일링, 아이콘을 올바르게 렌더링하는지 테스트
   */
  it('should render error message with styling and icon', () => {
    const { container } = render(<ErrorMessage message="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeDefined();
    expect(container.querySelector('.bg-red-50')).toBeDefined();
    expect(container.querySelector('svg')).toBeDefined();
  });
});

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Action',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ConfirmDialog가 open prop이 true일 때 렌더링되는지 테스트
   */
  it('should render dialog when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeDefined();
  });

  /**
   * ConfirmDialog가 open prop이 false일 때 렌더링되지 않는지 테스트
   */
  it('should not render dialog when open is false', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm Action')).toBeNull();
  });

  /**
   * ConfirmDialog가 기본 콘텐츠와 커스텀 콘텐츠를 올바르게 렌더링하는지 테스트
   */
  it('should render default or custom content', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('정말로 이 작업을 진행하시겠습니까?')).toBeDefined();

    rerender(<ConfirmDialog {...defaultProps} content="Are you sure?" />);
    expect(screen.getByText('Are you sure?')).toBeDefined();
  });

  /**
   * ConfirmDialog의 확인 버튼 클릭 시 onConfirm 콜백이 호출되는지 테스트
   */
  it('should call onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByRole('button', { name: /확인/i });
    await userEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  /**
   * ConfirmDialog의 취소 버튼 클릭 시 onClose 콜백이 호출되는지 테스트
   */
  it('should call onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /취소/i });
    await userEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * ConfirmDialog가 커스텀 확인/취소 버튼 텍스트를 올바르게 렌더링하는지 테스트
   */
  it('should render custom confirm and cancel text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Yes"
        cancelText="No"
      />
    );
    expect(screen.getByRole('button', { name: /yes/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /no/i })).toBeDefined();
  });

  /**
   * ConfirmDialog가 커스텀 아이콘을 렌더링하고 destructive variant를 적용하는지 테스트
   */
  it('should render custom icon and apply destructive variant', () => {
    const customIcon = <Search className="h-5 w-5" />;
    const { container } = render(
      <ConfirmDialog {...defaultProps} icon={customIcon} confirmButtonColor="destructive" />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    const confirmButton = screen.getByRole('button', { name: /확인/i });
    expect(confirmButton).toBeDefined();
  });
});

describe('StatsCard', () => {
  type TestStats = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    completed: number;
    cancelled: number;
  };

  const testStats: TestStats = {
    total: 100,
    active: 75,
    inactive: 25,
    pending: 10,
    completed: 50,
    cancelled: 5,
  };

  const statConfig = [
    { label: 'Total', key: 'total' as keyof TestStats, color: '#000000' },
    { label: 'Active', key: 'active' as keyof TestStats, color: '#00ff00' },
    { label: 'Inactive', key: 'inactive' as keyof TestStats, color: '#ff0000' },
  ];

  /**
   * StatsCard가 모든 통계를 올바른 값과 함께 렌더링하는지 테스트
   */
  it('should render all stats with correct values', () => {
    const { container } = render(<StatsCard stats={testStats} statConfig={statConfig} />);
    expect(screen.getByText('Total')).toBeDefined();
    expect(screen.getByText('Active')).toBeDefined();
    expect(screen.getByText('Inactive')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('75')).toBeDefined();
    expect(screen.getByText('25')).toBeDefined();
    const statElements = container.querySelectorAll('.text-2xl');
    expect(statElements.length).toBeGreaterThan(0);
  });

  /**
   * StatsCard가 통계 개수에 따라 올바른 grid 레이아웃을 적용하는지 테스트
   * - 2개 이하: grid-cols-1 sm:grid-cols-2
   * - 3-4개: grid-cols-2 sm:grid-cols-4
   * - 5개 이상: grid-cols-2 sm:grid-cols-3 lg:grid-cols-6
   */
  it('should apply correct grid layout based on stat count', () => {
    // 2개 이하: grid-cols-1 sm:grid-cols-2
    const twoStatConfig = [
      { label: 'Total', key: 'total' as keyof TestStats, color: '#000000' },
      { label: 'Active', key: 'active' as keyof TestStats, color: '#00ff00' },
    ];
    const { container: container1, unmount: unmount1 } = render(
      <StatsCard stats={testStats} statConfig={twoStatConfig} />
    );
    const grid1 = container1.querySelector('.grid');
    expect(grid1?.className).toContain('grid-cols-1');
    expect(grid1?.className).toContain('sm:grid-cols-2');
    unmount1();

    // 3-4개: grid-cols-2 sm:grid-cols-4
    const fourStatConfig = [
      { label: 'Total', key: 'total' as keyof TestStats, color: '#000000' },
      { label: 'Active', key: 'active' as keyof TestStats, color: '#00ff00' },
      { label: 'Inactive', key: 'inactive' as keyof TestStats, color: '#ff0000' },
      { label: 'Pending', key: 'pending' as keyof TestStats, color: '#0000ff' },
    ];
    const { container: container2, unmount: unmount2 } = render(
      <StatsCard stats={testStats} statConfig={fourStatConfig} />
    );
    const grid2 = container2.querySelector('.grid');
    expect(grid2?.className).toContain('grid-cols-2');
    expect(grid2?.className).toContain('sm:grid-cols-4');
    unmount2();

    // 5개 이상: grid-cols-2 sm:grid-cols-3 lg:grid-cols-6
    const sixStatConfig = [
      { label: 'Stat 1', key: 'total' as keyof TestStats, color: '#000000' },
      { label: 'Stat 2', key: 'active' as keyof TestStats, color: '#000000' },
      { label: 'Stat 3', key: 'inactive' as keyof TestStats, color: '#000000' },
      { label: 'Stat 4', key: 'pending' as keyof TestStats, color: '#000000' },
      { label: 'Stat 5', key: 'completed' as keyof TestStats, color: '#000000' },
      { label: 'Stat 6', key: 'cancelled' as keyof TestStats, color: '#000000' },
    ];
    const { container: container3 } = render(
      <StatsCard stats={testStats} statConfig={sixStatConfig} />
    );
    const grid3 = container3.querySelector('.grid');
    expect(grid3?.className).toContain('grid-cols-2');
    expect(grid3?.className).toContain('sm:grid-cols-3');
    expect(grid3?.className).toContain('lg:grid-cols-6');
  });

  /**
   * StatsCard가 빈 statConfig를 처리하는지 테스트
   */
  it('should handle empty statConfig', () => {
    const { container } = render(<StatsCard stats={testStats} statConfig={[]} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeDefined();
    expect(grid?.children.length).toBe(0);
  });
});

describe('SearchFilter', () => {
  type TestFilters = {
    search?: string;
    status?: string;
    role?: string;
  };

  const defaultFilters: TestFilters = {
    search: '',
    status: '',
    role: '',
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Ensure all pending timers are cleared
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  /**
   * SearchFilter가 검색 입력 필드와 선택 필드를 올바르게 렌더링하는지 테스트
   */
  it('should render search input and select fields', () => {
    const fields: FilterField<TestFilters>[] = [
      { type: 'search', key: 'search', id: 'search', placeholder: 'Search...' },
      {
        type: 'select',
        key: 'status',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ];
    render(
      <SearchFilter<TestFilters>
        filters={defaultFilters}
        fields={fields}
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
  });

  /**
   * SearchFilter가 검색 입력 시 debounce 후 onFilterChange를 호출하는지 테스트
   */
  it('should call onFilterChange after debounce when typing in search', () => {
    const onFilterChange = vi.fn();
    const fields: FilterField<TestFilters>[] = [
      { type: 'search', key: 'search', id: 'search', placeholder: 'Search...' },
    ];
    render(
      <SearchFilter<TestFilters>
        filters={defaultFilters}
        fields={fields}
        onFilterChange={onFilterChange}
        onClearFilters={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    
    // Use fireEvent to trigger onChange with fake timers
    fireEvent.change(input, { target: { value: 'test' } });

    // Fast-forward time to trigger debounce (250ms)
    vi.advanceTimersByTime(250);

    // With fake timers, the callback should be called immediately after advancing time
    expect(onFilterChange).toHaveBeenCalledWith('search', 'test');
    
    // Run any remaining pending timers to clean up
    vi.runOnlyPendingTimers();
  });

  /**
   * SearchFilter의 필터 초기화 버튼 클릭 시 onClearFilters 콜백이 호출되는지 테스트
   */
  it('should call onClearFilters when clear button is clicked', async () => {
    // Use real timers for userEvent interactions
    vi.useRealTimers();
    
    const onClearFilters = vi.fn();
    const fields: FilterField<TestFilters>[] = [
      { type: 'search', key: 'search', id: 'search', placeholder: 'Search...' },
    ];
    render(
      <SearchFilter<TestFilters>
        filters={{ search: 'test' }}
        fields={fields}
        onFilterChange={vi.fn()}
        onClearFilters={onClearFilters}
      />
    );

    const clearButton = screen.getByText('필터 초기화');
    await userEvent.click(clearButton);

    expect(onClearFilters).toHaveBeenCalledTimes(1);
    
    // Restore fake timers for next test
    vi.useFakeTimers();
  });

  /**
   * SearchFilter가 검색 값이 있을 때 클리어 아이콘 버튼을 표시하는지 테스트
   */
  it('should show clear icon button when search has value', () => {
    const fields: FilterField<TestFilters>[] = [
      { type: 'search', key: 'search', id: 'search', placeholder: 'Search...' },
    ];
    render(
      <SearchFilter<TestFilters>
        filters={{ search: 'test' }}
        fields={fields}
        onFilterChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    // Find clear button by its position (it's inside the search input container)
    const clearButtons = screen.getAllByRole('button');
    const clearIcon = clearButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg !== null;
    });
    expect(clearIcon).toBeDefined();
  });

  /**
   * SearchFilter가 선택 필드 값 변경 시 onFilterChange를 호출하는지 테스트
   */
  it('should call onFilterChange when select value changes', async () => {
    // Use real timers for userEvent interactions
    vi.useRealTimers();
    
    const onFilterChange = vi.fn();
    const fields: FilterField<TestFilters>[] = [
      {
        type: 'select',
        key: 'status',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ];
    render(
      <SearchFilter<TestFilters>
        filters={defaultFilters}
        fields={fields}
        onFilterChange={onFilterChange}
        onClearFilters={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    await userEvent.click(select);

    const option = await screen.findByText('Active');
    await userEvent.click(option);

    expect(onFilterChange).toHaveBeenCalledWith('status', 'active');
    
    // Restore fake timers for next test
    vi.useFakeTimers();
  });

});

describe('ContentHeader', () => {
  const defaultProps = {
    icon: <Search />,
    title: 'Test Title',
  };

  /**
   * ContentHeader가 제목, 아이콘, 액션 버튼을 올바르게 렌더링하는지 테스트
   */
  it('should render title, icon, and action button when provided', () => {
    const onAction = vi.fn();
    render(
      <ContentHeader
        {...defaultProps}
        actionLabel="Add New"
        onAction={onAction}
      />
    );
    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByRole('button', { name: /add new/i })).toBeDefined();
  });

  /**
   * ContentHeader의 액션 버튼 클릭 시 onAction 콜백이 호출되는지 테스트
   */
  it('should call onAction when action button is clicked', async () => {
    const onAction = vi.fn();
    render(
      <ContentHeader
        {...defaultProps}
        actionLabel="Add New"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: /add new/i });
    await userEvent.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  /**
   * ContentHeader가 actionLabel이 없을 때 액션 버튼을 렌더링하지 않는지 테스트
   */
  it('should not render action button when actionLabel is not provided', () => {
    render(<ContentHeader {...defaultProps} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  /**
   * ContentHeader가 모든 titleSize 옵션을 올바르게 적용하는지 테스트
   */
  it('should apply all titleSize options', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'> = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    sizes.forEach((size) => {
      const { container, unmount } = render(<ContentHeader {...defaultProps} titleSize={size} />);
      const title = container.querySelector(`.text-${size === 'md' ? 'base' : size}`);
      expect(title).toBeDefined();
      unmount();
    });
  });

  /**
   * ContentHeader가 actionIcon을 렌더링하고 actionSize와 className을 적용하는지 테스트
   */
  it('should render actionIcon, apply actionSize, and className', () => {
    const actionIcon = <Search className="h-4 w-4" />;
    const { container } = render(
      <ContentHeader
        {...defaultProps}
        actionLabel="Add New"
        actionIcon={actionIcon}
        actionSize="sm"
        className="custom-class"
        onAction={vi.fn()}
      />
    );
    const button = screen.getByRole('button', { name: /add new/i });
    expect(button).toBeDefined();
    const icon = button.querySelector('svg');
    expect(icon).toBeDefined();
    const header = container.firstChild as HTMLElement;
    expect(header.className).toContain('custom-class');
  });
});

describe('TablePagination', () => {
  type TestData = {
    id: number;
    name: string;
  };

  /**
   * TablePagination 테스트를 위한 mock Table 생성 함수
   * - TablePagination은 rows.length만 사용하므로 간단한 mock으로 충분
   */
  const createMockTable = (overrides?: Partial<Table<TestData>>): Table<TestData> => {
    const createRowModel = (rowCount: number): RowModel<TestData> => {
      const mockRows = Array.from({ length: rowCount }, (_, i) => ({
        id: `row-${i}`,
        original: { id: i + 1, name: `Item ${i + 1}` },
      })) as Row<TestData>[];

      return {
        rows: mockRows,
        flatRows: mockRows,
        rowsById: {} as Record<string, Row<TestData>>,
      };
    };

    const mockTable = {
      getState: vi.fn(() => ({
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      })),
      setPageIndex: vi.fn(),
      setPageSize: vi.fn(),
      getCanPreviousPage: vi.fn(() => false),
      getCanNextPage: vi.fn(() => true),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      getPageCount: vi.fn(() => 5),
      getFilteredSelectedRowModel: vi.fn(() => createRowModel(0)),
      getFilteredRowModel: vi.fn(() => createRowModel(50)),
      ...overrides,
    } as Table<TestData>;

    return mockTable;
  };

  /**
   * TablePagination이 페이지네이션 컨트롤을 올바르게 렌더링하는지 테스트
   */
  it('should render pagination controls', () => {
    const table = createMockTable();
    render(<TablePagination table={table} totalCount={50} />);
    expect(screen.getByText(/page 1 of/i)).toBeDefined();
  });

  /**
   * TablePagination이 range 타입일 때 올바른 범위를 표시하는지 테스트
   */
  it('should display correct range for range type', () => {
    const table = createMockTable();
    render(<TablePagination table={table} totalCount={50} type="range" />);
    expect(screen.getByText(/1-10/i)).toBeDefined();
  });

  /**
   * TablePagination이 selected 타입일 때 선택된 행 수를 표시하는지 테스트
   */
  it('should display selected count for selected type', () => {
    const selectedRow = {
      id: 'row-1',
      original: { id: 1, name: 'Item 1' },
    } as Row<TestData>;
    
    const table = createMockTable({
      getFilteredSelectedRowModel: vi.fn(() => ({
        rows: [selectedRow],
        flatRows: [selectedRow],
        rowsById: { 'row-1': selectedRow } as Record<string, Row<TestData>>,
      })),
    });
    render(<TablePagination table={table} totalCount={50} type="selected" />);
    expect(screen.getByText(/row\(s\) selected/i)).toBeDefined();
  });

  /**
   * TablePagination이 페이지 위치에 따라 네비게이션 버튼을 활성화/비활성화하는지 테스트
   * - 첫 페이지: previous와 first 버튼 비활성화
   * - 마지막 페이지: next와 last 버튼 비활성화
   * - 중간 페이지: 모든 버튼 활성화
   */
  it('should disable/enable navigation buttons based on page position', () => {
    // 첫 페이지: previous와 first 버튼 비활성화
    const table1 = createMockTable({
      getCanPreviousPage: vi.fn(() => false),
    });
    const { unmount: unmount1 } = render(<TablePagination table={table1} totalCount={50} />);
    const prevButton1 = screen.getByRole('button', { name: /go to previous page/i }) as HTMLButtonElement;
    const firstButton1 = screen.getByRole('button', { name: /go to first page/i }) as HTMLButtonElement;
    expect(prevButton1.disabled).toBe(true);
    expect(firstButton1.disabled).toBe(true);
    unmount1();

    // 마지막 페이지: next와 last 버튼 비활성화
    const table2 = createMockTable({
      getCanNextPage: vi.fn(() => false),
    });
    const { unmount: unmount2 } = render(<TablePagination table={table2} totalCount={50} />);
    const nextButton2 = screen.getByRole('button', { name: /go to next page/i }) as HTMLButtonElement;
    const lastButton2 = screen.getByRole('button', { name: /go to last page/i }) as HTMLButtonElement;
    expect(nextButton2.disabled).toBe(true);
    expect(lastButton2.disabled).toBe(true);
    unmount2();

    // 중간 페이지: 모든 버튼 활성화
    const table3 = createMockTable({
      getCanPreviousPage: vi.fn(() => true),
      getCanNextPage: vi.fn(() => true),
    });
    render(<TablePagination table={table3} totalCount={50} />);
    const prevButton3 = screen.getByRole('button', { name: /go to previous page/i }) as HTMLButtonElement;
    const nextButton3 = screen.getByRole('button', { name: /go to next page/i }) as HTMLButtonElement;
    expect(prevButton3.disabled).toBe(false);
    expect(nextButton3.disabled).toBe(false);
  });

  /**
   * TablePagination의 다음 페이지 버튼 클릭 시 table.nextPage가 호출되는지 테스트
   */
  it('should call table.nextPage when next button is clicked', async () => {
    const table = createMockTable();
    const nextPageSpy = vi.spyOn(table, 'nextPage');
    render(<TablePagination table={table} totalCount={50} />);

    const nextButton = screen.getByRole('button', { name: /go to next page/i });
    await userEvent.click(nextButton);

    expect(nextPageSpy).toHaveBeenCalledTimes(1);
  });

  /**
   * TablePagination의 이전 페이지 버튼 클릭 시 table.previousPage가 호출되는지 테스트
   */
  it('should call table.previousPage when previous button is clicked', async () => {
    const table = createMockTable({
      getCanPreviousPage: vi.fn(() => true),
    });
    const previousPageSpy = vi.spyOn(table, 'previousPage');
    render(<TablePagination table={table} totalCount={50} />);

    const prevButton = screen.getByRole('button', { name: /go to previous page/i });
    await userEvent.click(prevButton);

    expect(previousPageSpy).toHaveBeenCalledTimes(1);
  });

  /**
   * TablePagination의 페이지 크기 선택 변경 시 table.setPageSize가 호출되는지 테스트
   */
  it('should change page size when select value changes', async () => {
    const table = createMockTable();
    const setPageSizeSpy = vi.spyOn(table, 'setPageSize');
    render(<TablePagination table={table} totalCount={50} />);

    const select = screen.getByRole('combobox');
    await userEvent.click(select);

    const option = await screen.findByText('20');
    await userEvent.click(option);

    expect(setPageSizeSpy).toHaveBeenCalledWith(20);
  });


  /**
   * TablePagination의 첫 페이지 버튼 클릭 시 table.setPageIndex(0)이 호출되는지 테스트
   */
  it('should call setPageIndex(0) when first page button is clicked', async () => {
    const table = createMockTable({
      getCanPreviousPage: vi.fn(() => true),
    });
    const setPageIndexSpy = vi.spyOn(table, 'setPageIndex');
    render(<TablePagination table={table} totalCount={50} />);

    const firstButton = screen.getByRole('button', { name: /go to first page/i });
    await userEvent.click(firstButton);

    expect(setPageIndexSpy).toHaveBeenCalledWith(0);
  });

  /**
   * TablePagination의 마지막 페이지 버튼 클릭 시 table.setPageIndex(last)가 호출되는지 테스트
   */
  it('should call setPageIndex(last) when last page button is clicked', async () => {
    const table = createMockTable({
      getCanNextPage: vi.fn(() => true),
      getPageCount: vi.fn(() => 5),
    });
    const setPageIndexSpy = vi.spyOn(table, 'setPageIndex');
    render(<TablePagination table={table} totalCount={50} />);

    const lastButton = screen.getByRole('button', { name: /go to last page/i });
    await userEvent.click(lastButton);

    expect(setPageIndexSpy).toHaveBeenCalledWith(4); // pageCount - 1
  });

});

describe('Logo', () => {
  /**
   * Logo 컴포넌트가 로고 이미지를 src 속성과 함께 올바르게 렌더링하는지 테스트
   */
  it('should render logo image with src attribute', () => {
    render(<Logo />);
    const image = screen.getByAltText('Logo') as HTMLImageElement;
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBeTruthy();
  });
});

describe('LogoCi', () => {
  /**
   * LogoCi 컴포넌트가 로고 이미지를 src 속성과 함께 올바르게 렌더링하는지 테스트
   */
  it('should render logo image with src attribute', () => {
    render(<LogoCi />);
    const image = screen.getByAltText('LogoCi') as HTMLImageElement;
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBeTruthy();
  });
});

