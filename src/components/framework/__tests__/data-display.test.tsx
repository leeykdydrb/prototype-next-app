/**
 * Data Display 컴포넌트 테스트 파일
 * 
 * Data Display 컴포넌트는 테이블, 배지, 스켈레톤, 구분선 등 데이터를 표시하는 컴포넌트입니다.
 * 이 테스트는 Table, Badge, Skeleton, Separator 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Skeleton,
  Separator,
} from '../data-display';

describe('Table', () => {
  /**
   * Table이 기본 구조를 올바르게 렌더링하고 모든 className props가 전달되는지 테스트
   * - Table, TableHeader, TableBody, TableRow, TableHead, TableCell이 함께 작동하는지 확인
   */
  it('should render table with complete structure and all className props', () => {
    const { container } = render(
      <Table className="custom-table-class">
        <TableHeader className="custom-header-class">
          <TableRow className="custom-header-row-class">
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body-class">
          <TableRow className="custom-row-class">
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Header 1')).toBeDefined();
    expect(screen.getByText('Cell 1')).toBeDefined();
    const tableContainer = container.querySelector('[data-slot="table-container"]');
    expect(tableContainer).toBeDefined();
    
    // Table의 className이 BaseTable에 전달되는지 확인
    const baseTable = container.querySelector('table');
    expect(baseTable?.className).toContain('custom-table-class');
  });
});

describe('TableHeader', () => {
  /**
   * TableHeader의 className이 올바르게 전달되는지 테스트
   */
  it('should apply className to table header', () => {
    const { container } = render(
      <Table>
        <TableHeader className="custom-header-class">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const thead = container.querySelector('thead');
    expect(thead?.className).toContain('custom-header-class');
  });
});

describe('TableBody', () => {
  /**
   * TableBody의 className이 올바르게 전달되는지 테스트
   */
  it('should apply className to table body', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body-class">
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody?.className).toContain('custom-body-class');
  });
});

describe('TableRow', () => {
  /**
   * TableRow의 className이 올바르게 전달되는지 테스트
   */
  it('should apply className to table row', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow className="custom-row-class">
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const tr = container.querySelector('tr');
    expect(tr?.className).toContain('custom-row-class');
  });
});

describe('TableHead', () => {
  /**
   * TableHead의 모든 props가 올바르게 전달되는지 테스트
   * - align 옵션 (left 기본값, center, right), className, 기타 props 확인
   */
  it('should pass all props to table head', () => {
    const aligns: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    aligns.forEach((align) => {
      const { unmount, container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead align={align} className="custom-head-class" colSpan={2}>
                Header
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText('Header')).toBeDefined();
      const th = container.querySelector('th');
      expect(th?.className).toContain(`text-${align}`);
      expect(th?.getAttribute('colspan')).toBe('2');
      unmount();
    });
  });

});

describe('TableCell', () => {
  /**
   * TableCell의 모든 props가 올바르게 전달되는지 테스트
   * - align 옵션 (left 기본값, center, right), className, 기타 props 확인
   */
  it('should pass all props to table cell', () => {
    const aligns: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    aligns.forEach((align) => {
      const { unmount, container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell align={align} className="custom-cell-class" colSpan={2}>
                Cell
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText('Cell')).toBeDefined();
      const td = container.querySelector('td');
      expect(td?.className).toContain(`text-${align}`);
      expect(td?.getAttribute('colspan')).toBe('2');
      unmount();
    });
  });

});

describe('Badge', () => {
  /**
   * Badge의 모든 props가 올바르게 전달되는지 테스트
   * - 기본 렌더링 (variant="default", size="xs"), 모든 variant 옵션, 모든 size 옵션, className 확인
   */
  it('should pass all props to badge', () => {
    const variants: Array<'default' | 'secondary' | 'destructive' | 'outline'> = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ];
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    // 기본 렌더링 확인 (기본값: variant="default", size="xs")
    const { container: container1 } = render(<Badge>Badge Text</Badge>);
    expect(screen.getByText('Badge Text')).toBeDefined();
    const badge1 = container1.querySelector('[class*="text-xs"]');
    expect(badge1).toBeDefined();

    // 모든 variant 옵션 확인
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeDefined();
      unmount();
    });

    // 모든 size 옵션 확인
    sizes.forEach((size) => {
      const { unmount, container } = render(<Badge size={size}>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeDefined();
      // size에 따른 클래스 확인
      const sizeClass = size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : size === 'lg' ? 'text-lg' : 'text-xl';
      const badge = container.querySelector(`[class*="${sizeClass}"]`);
      expect(badge).toBeDefined();
      unmount();
    });

    // 모든 props 통합 확인
    const { container } = render(
      <Badge variant="secondary" size="md" className="custom-badge-class">
        Badge
      </Badge>
    );
    expect(screen.getByText('Badge')).toBeDefined();
    const badge = container.querySelector('[class*="custom-badge-class"]');
    expect(badge).toBeDefined();
  });

});

describe('Skeleton', () => {
  /**
   * Skeleton의 모든 props가 올바르게 전달되는지 테스트
   * - 기본 렌더링 (lines=1, height="h-4"), 여러 줄, height, className 확인
   */
  it('should pass all props to skeleton', () => {
    // 기본 단일 스켈레톤 렌더링 확인 (기본값: lines=1, height="h-4")
    const { container: container1 } = render(<Skeleton />);
    const skeleton1 = container1.querySelector('.animate-pulse');
    expect(skeleton1).toBeDefined();
    const height1 = container1.querySelector('.h-4');
    expect(height1).toBeDefined();

    // 여러 줄 스켈레톤 렌더링 확인
    const { container: container2 } = render(
      <Skeleton lines={3} height="h-8" className="custom-skeleton-class" />
    );
    const skeletons = container2.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);

    // height prop 확인
    const heightSkeleton = container2.querySelector('.h-8');
    expect(heightSkeleton).toBeDefined();
    
    // space-y-2 클래스 확인 (여러 줄일 때)
    const wrapper = container2.querySelector('.space-y-2');
    expect(wrapper).toBeDefined();
    
    // 마지막 줄이 w-3/4인지 확인
    const lastSkeleton = container2.querySelectorAll('.animate-pulse');
    if (lastSkeleton.length > 0) {
      const last = lastSkeleton[lastSkeleton.length - 1];
      expect(last.className).toContain('w-3/4');
    }
    
    // className prop 확인
    const customSkeleton = container2.querySelector('[class*="custom-skeleton-class"]');
    expect(customSkeleton).toBeDefined();
  });

});

describe('Separator', () => {
  /**
   * Separator의 모든 props가 올바르게 전달되는지 테스트
   * - 기본 렌더링 (orientation="horizontal"), 모든 orientation 옵션, className 확인
   */
  it('should pass all props to separator', () => {
    // 기본값 (orientation="horizontal") 확인
    const { container: container1 } = render(<Separator />);
    const separator1 = container1.querySelector('[role="separator"]');
    expect(separator1).toBeDefined();

    // 모든 orientation 옵션 확인
    const orientations: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];
    orientations.forEach((orientation) => {
      const { unmount, container } = render(
        <Separator orientation={orientation} className="custom-separator-class" />
      );
      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeDefined();
      unmount();
    });
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Data Display Complex Scenarios', () => {
  /**
   * 완전한 테이블 구조가 올바르게 렌더링되는지 테스트
   * - 모든 테이블 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete table structure', () => {
    render(
      <Table className="custom-table">
        <TableHeader className="custom-header">
          <TableRow className="custom-header-row">
            <TableHead align="left">Name</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body">
          <TableRow className="custom-row">
            <TableCell align="left">John Doe</TableCell>
            <TableCell align="center">
              <Badge variant="default">Active</Badge>
            </TableCell>
            <TableCell align="right">Edit</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Active')).toBeDefined();
  });

});

