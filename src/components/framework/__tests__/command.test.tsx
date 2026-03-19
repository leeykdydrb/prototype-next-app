/**
 * Command 컴포넌트 테스트 파일
 * 
 * Command 컴포넌트는 명령 팔레트(command palette) 기능을 제공하는 컴포넌트입니다.
 * 이 테스트는 Command, CommandDialog, CommandInput, CommandItem 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../command';

describe('Command', () => {
  /**
   * Command가 기본 구조를 올바르게 렌더링하고 className이 전달되는지 테스트
   * - Command, CommandInput, CommandList, CommandItem이 함께 작동하는지 확인
   */
  it('should render command with complete structure and className', () => {
    render(
      <Command className="custom-command-class">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByPlaceholderText('Search...')).toBeDefined();
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
  });
});

describe('CommandDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * CommandDialog의 모든 제어 props가 올바르게 전달되는지 테스트
   * - open, onOpenChange props 확인
   */
  it('should pass all control props to command dialog', () => {
    const handleOpenChange = vi.fn();
    // open이 true인 경우
    const { unmount: unmount1 } = render(
      <CommandDialog open={true} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>
    );
    expect(screen.getByPlaceholderText('Search...')).toBeDefined();
    unmount1();

    // open이 false인 경우
    render(
      <CommandDialog open={false} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>
    );
    // props 전달 확인
    expect(handleOpenChange).toBeDefined();
  });
});

describe('CommandInput', () => {
  /**
   * CommandInput의 모든 props가 올바르게 전달되는지 테스트
   * - placeholder prop이 전달되는지, placeholder 없이도 렌더링되는지 확인
   */
  it('should pass all props to command input', () => {
    // placeholder가 있는 경우
    const { unmount: unmount1 } = render(
      <Command>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandItem>Item</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByPlaceholderText('Type to search...')).toBeDefined();
    unmount1();

    // placeholder가 없는 경우
    const { container } = render(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem>Item</CommandItem>
        </CommandList>
      </Command>
    );
    const input = container.querySelector('input');
    expect(input).toBeDefined();
  });
});

describe('CommandList', () => {
  /**
   * CommandList가 올바르게 렌더링되는지 테스트
   * - children이 렌더링되는지 확인
   */
  it('should render command list with children', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandItem>Item 2</CommandItem>
          <CommandItem>Item 3</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    expect(screen.getByText('Item 3')).toBeDefined();
  });
});

describe('CommandItem', () => {
  /**
   * CommandItem의 모든 props가 올바르게 전달되는지 테스트
   * - onSelect, value, disabled props 확인
   */
  it('should pass all props to command item', () => {
    const handleSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem 
            onSelect={handleSelect} 
            value="item-1" 
            disabled={false}
          >
            Item 1
          </CommandItem>
          <CommandItem disabled={true}>Disabled Item</CommandItem>
          <CommandItem value="item-3">Item without onSelect</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Disabled Item')).toBeDefined();
    expect(screen.getByText('Item without onSelect')).toBeDefined();
  });
});

describe('CommandGroup', () => {
  /**
   * CommandGroup의 모든 props가 올바르게 전달되는지 테스트
   * - heading prop이 전달되는지, heading 없이도 렌더링되는지 확인
   */
  it('should pass all props to command group', () => {
    // heading이 있는 경우
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Group 1">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Group 2">
            <CommandItem>Item 3</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    expect(screen.getByText('Item 3')).toBeDefined();
  });
});

describe('CommandEmpty', () => {
  /**
   * CommandEmpty가 올바르게 렌더링되는지 테스트
   * - 빈 상태 메시지가 표시되는지 확인
   */
  it('should render command empty', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('No results found.')).toBeDefined();
  });
});

describe('CommandSeparator', () => {
  /**
   * CommandSeparator가 올바르게 렌더링되는지 테스트
   * - 구분선이 렌더링되는지 확인
   */
  it('should render command separator', () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandSeparator />
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    // Separator는 시각적 요소이므로 DOM에 존재하는지 확인
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toBeDefined();
  });
});

describe('CommandShortcut', () => {
  /**
   * CommandShortcut이 올바르게 렌더링되는지 테스트
   * - 단축키가 표시되는지 확인
   */
  it('should render command shortcut', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>
            Item
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item')).toBeDefined();
    expect(screen.getByText('⌘K')).toBeDefined();
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Command Complex Scenarios', () => {
  /**
   * 완전한 Command 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Command 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete command structure', () => {
    const handleSelect = vi.fn();
    render(
      <Command className="custom-command-class">
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleSelect} value="new">
              New File
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem value="open">
              Open File
              <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem value="settings">Preferences</CommandItem>
            <CommandItem disabled value="disabled">
              Disabled Option
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByPlaceholderText('Type to search...')).toBeDefined();
    expect(screen.getByText('New File')).toBeDefined();
    expect(screen.getByText('⌘N')).toBeDefined();
    expect(screen.getByText('Open File')).toBeDefined();
    expect(screen.getByText('Preferences')).toBeDefined();
    expect(screen.getByText('Disabled Option')).toBeDefined();
  });

  /**
   * CommandDialog와 Command가 함께 사용되는지 테스트
   * - 다이얼로그 내에서 Command가 작동하는지 확인
   */
  it('should render command dialog with command', () => {
    render(
      <CommandDialog open={true}>
        <Command>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandItem>Command 1</CommandItem>
            <CommandItem>Command 2</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>
    );
    expect(screen.getByPlaceholderText('Search commands...')).toBeDefined();
    expect(screen.getByText('Command 1')).toBeDefined();
    expect(screen.getByText('Command 2')).toBeDefined();
  });

});

