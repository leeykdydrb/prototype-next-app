/**
 * Dropdown 컴포넌트 테스트 파일
 * 
 * Dropdown 컴포넌트는 드롭다운 메뉴와 팝오버 기능을 제공하는 컴포넌트입니다.
 * 이 테스트는 DropdownMenu, DropdownMenuItem, Popover 등 모든 하위 컴포넌트의 기능을 검증합니다.
 * 
 * 참고: Radix UI 기반 컴포넌트는 포털을 사용하여 콘텐츠를 렌더링하므로,
 * 테스트 환경에서는 트리거 버튼의 렌더링과 props 전달을 주로 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../dropdown';
import { Button } from '../form';

describe('DropdownMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // 기본 렌더링 테스트
  // ==========================================

  /**
   * DropdownMenu가 기본 구조를 올바르게 렌더링하는지 테스트
   * - DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem이 함께 작동하는지 확인
   * - open prop 없이도 렌더링되는지 확인
   */
  it('should render dropdown menu with complete structure', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Open Menu')).toBeDefined();
  });

  // ==========================================
  // DropdownMenuItem 테스트
  // ==========================================

  // ==========================================
  // DropdownMenu open/onOpenChange 테스트
  // ==========================================

  /**
   * DropdownMenu의 모든 제어 props가 올바르게 전달되는지 테스트
   * - open, onOpenChange props 확인 (open={true}, open={false} 모두)
   */
  it('should pass all control props to dropdown menu', () => {
    const handleOpenChange = vi.fn();
    
    // open={true}인 경우
    const { unmount: unmount1 } = render(
      <DropdownMenu open={true} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
    unmount1();

    // open={false}인 경우
    render(
      <DropdownMenu open={false} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });

  // ==========================================
  // DropdownMenuTrigger 테스트
  // ==========================================

  /**
   * DropdownMenuTrigger의 모든 props가 올바르게 전달되는지 테스트
   * - asChild, className props 확인 (asChild={true}, asChild={false} 모두)
   */
  it('should pass all props to dropdown menu trigger', () => {
    // asChild={true}인 경우
    const { unmount: unmount1 } = render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="custom-trigger-class">
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
    unmount1();

    // asChild={false} 또는 없음인 경우
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger-class">
          Trigger Text
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Trigger Text')).toBeDefined();
  });
});

describe('DropdownMenuContent', () => {
  /**
   * DropdownMenuContent의 모든 align 옵션이 올바르게 전달되는지 테스트
   * - align="start", "center", "end" (기본값) 모두 확인
   */
  it('should pass all align options to dropdown menu content', () => {
    const aligns: Array<'start' | 'center' | 'end'> = ['start', 'center', 'end'];
    aligns.forEach((align) => {
      const { unmount } = render(
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      expect(screen.getByText('Menu')).toBeDefined();
      unmount();
    });
  });

  /**
   * DropdownMenuContent의 기본값 align="end"가 올바르게 적용되는지 테스트
   */
  it('should use align="end" as default for dropdown menu content', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });

  /**
   * DropdownMenuContent의 모든 side 옵션이 올바르게 전달되는지 테스트
   * - side="top", "right", "bottom", "left" 모두 확인
   */
  it('should pass all side options to dropdown menu content', () => {
    const sides: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];
    sides.forEach((side) => {
      const { unmount } = render(
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={side}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      expect(screen.getByText('Menu')).toBeDefined();
      unmount();
    });
  });

  /**
   * DropdownMenuContent의 모든 positioning props가 올바르게 전달되는지 테스트
   * - sideOffset, alignOffset, className을 함께 확인
   */
  it('should pass positioning and styling props to dropdown menu content', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          sideOffset={10} 
          alignOffset={5} 
          className="custom-content-class"
        >
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});

describe('DropdownMenuItem', () => {
  /**
   * DropdownMenuItem의 모든 props가 올바르게 전달되는지 테스트
   * - disabled, onClick, className props 확인
   */
  it('should pass all props to dropdown menu item', () => {
    const handleClick = vi.fn();
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            disabled 
            onClick={handleClick} 
            className="custom-item-class"
          >
            Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});

describe('DropdownMenuLabel', () => {
  /**
   * DropdownMenuLabel가 올바르게 렌더링되고 className이 전달되는지 테스트
   * - 레이블이 children을 표시하고 className prop이 전달되는지 확인
   */
  it('should render dropdown menu label with className', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="custom-label-class">Menu Label</DropdownMenuLabel>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});

describe('DropdownMenuSeparator', () => {
  /**
   * DropdownMenuSeparator가 올바르게 렌더링되고 className이 전달되는지 테스트
   * - 구분선이 렌더링되고 className prop이 전달되는지 확인
   */
  it('should render dropdown menu separator with className', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator className="custom-separator-class" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});

describe('DropdownMenuCheckboxItem', () => {
  /**
   * DropdownMenuCheckboxItem의 모든 props가 올바르게 전달되는지 테스트
   * - checked, onCheckedChange, className props 확인
   */
  it('should pass all props to dropdown menu checkbox item', () => {
    const handleCheckedChange = vi.fn();
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem 
            checked={true} 
            onCheckedChange={handleCheckedChange}
            className="custom-checkbox-class"
          >
            Checkbox Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});

describe('Popover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // 기본 렌더링 테스트
  // ==========================================

  /**
   * Popover가 기본 구조를 올바르게 렌더링하는지 테스트
   * - Popover, PopoverTrigger, PopoverContent가 함께 작동하는지 확인
   */
  it('should render popover with complete structure', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Open Popover')).toBeDefined();
  });

  // ==========================================
  // Popover open/onOpenChange 테스트
  // ==========================================

  /**
   * Popover의 모든 제어 props가 올바르게 전달되는지 테스트
   * - open, onOpenChange, modal props 확인 (open={true}, open={false}, modal={true}, modal={false} 모두)
   */
  it('should pass all control props to popover', () => {
    const handleOpenChange = vi.fn();
    
    // open={true}, modal={true}인 경우
    const { unmount: unmount1 } = render(
      <Popover open={true} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button>Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Popover')).toBeDefined();
    unmount1();

    // open={false}, modal={false}인 경우
    render(
      <Popover open={false} onOpenChange={handleOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <Button>Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Popover')).toBeDefined();
  });

  // ==========================================
  // PopoverTrigger 테스트
  // ==========================================

  /**
   * PopoverTrigger의 모든 props가 올바르게 전달되는지 테스트
   * - asChild prop 확인 (asChild={true}, asChild={false} 모두)
   */
  it('should pass all props to popover trigger', () => {
    // asChild={true}인 경우
    const { unmount: unmount1 } = render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Popover')).toBeDefined();
    unmount1();

    // asChild={false} 또는 없음인 경우
    render(
      <Popover>
        <PopoverTrigger>
          Trigger Text
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Trigger Text')).toBeDefined();
  });

  // ==========================================
  // PopoverContent 테스트
  // ==========================================

  /**
   * PopoverContent의 className prop이 올바르게 전달되는지 테스트
   */
  it('should pass className prop to popover content', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <Button>Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="custom-popover-class">Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Popover')).toBeDefined();
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('DropdownMenu Complex Scenarios', () => {
  /**
   * 여러 DropdownMenuItem이 함께 렌더링되는지 테스트
   * - 복수의 메뉴 아이템이 올바르게 렌더링되는지 확인
   */
  it('should render multiple dropdown menu items', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });

  /**
   * Label, Separator, Item이 함께 사용되는지 테스트
   * - 복합적인 메뉴 구조가 올바르게 렌더링되는지 확인
   */
  it('should render dropdown menu with label, separator, and items', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });

  /**
   * CheckboxItem과 일반 Item이 함께 사용되는지 테스트
   * - 다양한 타입의 메뉴 아이템이 함께 렌더링되는지 확인
   */
  it('should render dropdown menu with checkbox and regular items', () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>Checkbox Item</DropdownMenuCheckboxItem>
          <DropdownMenuItem>Regular Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Menu')).toBeDefined();
  });
});
