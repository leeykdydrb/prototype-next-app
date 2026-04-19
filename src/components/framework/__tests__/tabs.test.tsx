/**
 * Tabs 컴포넌트 테스트 파일
 * 
 * Tabs 컴포넌트는 탭 인터페이스를 제공하는 컴포넌트입니다.
 * 이 테스트는 Tabs, TabsList, TabsTrigger, TabsContent 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../layout/tabs';

describe('Tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tabs의 className과 defaultValue가 올바르게 작동하는지 테스트
   */
  it('should apply className and defaultValue', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" className="custom-tabs-class">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    const tabs = container.querySelector('[role="tablist"]')?.parentElement;
    expect(tabs?.className).toContain('custom-tabs-class');
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Content 1')).toBeDefined();
  });

  /**
   * Tabs가 제어 모드(value)에서 올바르게 작동하는지 테스트
   * - 같은 Tabs 인스턴스에서 defaultValue ↔ value 전환(rerender)은 React 경고를 유발할 수 있어 분리합니다.
   */
  it('should work in controlled mode with value', async () => {
    const user = userEvent.setup();

    function ControlledTabsHarness({ initialValue }: { initialValue: string }) {
      const [value, setValue] = useState(initialValue);

      return (
        <Tabs value={value} onValueChange={setValue} className="custom-tabs-class">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    }

    const { container } = render(<ControlledTabsHarness initialValue="tab1" />);

    const tabs = container.querySelector('[role="tablist"]')?.parentElement;
    expect(tabs?.className).toContain('custom-tabs-class');

    expect(screen.getByText('Tab 1').getAttribute('data-state')).toBe('active');
    expect(screen.getByText('Content 1')).toBeDefined();

    await user.click(screen.getByText('Tab 2'));

    await waitFor(() => {
      expect(screen.getByText('Tab 2').getAttribute('data-state')).toBe('active');
      expect(screen.getByText('Content 2')).toBeDefined();
    });
  });


  /**
   * Tabs의 onValueChange 콜백이 올바르게 호출되는지 테스트
   */
  it('should call onValueChange when tab is clicked', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByText('Tab 2');
    await user.click(tab2);

    expect(handleValueChange).toHaveBeenCalledWith('tab2');
  });
});

describe('TabsList', () => {
  /**
   * TabsList가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render tabs list with children and className', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-list-class">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
    const list = container.querySelector('[role="tablist"]');
    expect(list?.className).toContain('custom-list-class');
  });
});

describe('TabsTrigger', () => {
  /**
   * TabsTrigger가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render tabs trigger with value and className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger-class">
            Trigger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute('role')).toBe('tab');
    expect(trigger.className).toContain('custom-trigger-class');
    expect(screen.getByText('Content')).toBeDefined();
  });

  /**
   * TabsTrigger 클릭 시 해당 탭이 활성화되는지 테스트
   */
  it('should activate tab when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByText('Tab 2');
    await user.click(tab2);

    expect(tab2.getAttribute('data-state')).toBe('active');
  });

});

describe('TabsContent', () => {
  /**
   * TabsContent가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render tabs content with value and className', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content-class">
          Content
        </TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Content')).toBeDefined();
    const content = container.querySelector('[role="tabpanel"]');
    expect(content?.className).toContain('custom-content-class');
  });

  /**
   * TabsContent가 활성화된 탭에만 표시되는지 테스트
   * - 비활성화된 탭의 콘텐츠는 숨겨지는지 확인
   */
  it('should show only active tab content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    // 활성화된 탭 트리거와 콘텐츠 확인
    const tab1Trigger = screen.getByText('Tab 1');
    expect(tab1Trigger.getAttribute('data-state')).toBe('active');
    expect(screen.getByText('Content 1')).toBeDefined();

    // 비활성화된 탭 트리거 확인
    const tab2Trigger = screen.getByText('Tab 2');
    expect(tab2Trigger.getAttribute('data-state')).toBe('inactive');
    
    // 비활성화된 탭 콘텐츠는 DOM에 없거나 숨겨져 있음
    // Radix UI는 비활성화된 콘텐츠를 DOM에서 제거하거나 hidden 속성으로 숨김
    // Content 2는 queryByText로 확인 (없을 수 있음)
    const content2 = screen.queryByText('Content 2');
    // 비활성화된 콘텐츠는 DOM에 없거나 hidden 속성을 가져야 함
    if (content2) {
      // 만약 DOM에 있다면 hidden이어야 함
      const isHidden = content2.getAttribute('hidden') !== null || 
                       content2.getAttribute('aria-hidden') === 'true' ||
                       content2.style.display === 'none';
      expect(isHidden).toBe(true);
    }
  });

});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Tabs Complex Scenarios', () => {
  /**
   * 완전한 탭 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Tabs 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete tabs structure', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" className="custom-trigger">
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">
          Content 1
        </TabsContent>
        <TabsContent value="tab2" className="custom-content">
          Content 2
        </TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
    expect(screen.getByText('Content 1')).toBeDefined();
  });

  /**
   * 여러 탭 간 전환이 올바르게 작동하는지 테스트
   * - 탭 클릭 시 콘텐츠가 변경되는지 확인
   */
  it('should switch between tabs correctly', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );

    // 초기 상태: Tab 1이 활성화
    const tab1Trigger = screen.getByText('Tab 1');
    expect(tab1Trigger.getAttribute('data-state')).toBe('active');
    expect(screen.getByText('Content 1')).toBeDefined();

    // Tab 2 클릭
    const tab2Trigger = screen.getByText('Tab 2');
    await user.click(tab2Trigger);
    
    // Tab 2가 활성화되고 콘텐츠가 표시되는지 확인
    await waitFor(() => {
      expect(tab2Trigger.getAttribute('data-state')).toBe('active');
      expect(screen.getByText('Content 2')).toBeDefined();
    });

    // Tab 1은 비활성화되어야 함
    expect(tab1Trigger.getAttribute('data-state')).toBe('inactive');

    // Tab 3 클릭
    const tab3Trigger = screen.getByText('Tab 3');
    await user.click(tab3Trigger);
    
    // Tab 3이 활성화되고 콘텐츠가 표시되는지 확인
    await waitFor(() => {
      expect(tab3Trigger.getAttribute('data-state')).toBe('active');
      expect(screen.getByText('Content 3')).toBeDefined();
    });

    // Tab 2는 비활성화되어야 함
    expect(tab2Trigger.getAttribute('data-state')).toBe('inactive');
  });

  /**
   * Controlled Tabs가 올바르게 작동하는지 테스트
   * - value와 onValueChange를 사용한 제어 테스트
   */
  it('should work as controlled component', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    function ControlledTabsHarness({ initialValue }: { initialValue: string }) {
      const [value, setValue] = useState(initialValue);

      return (
        <Tabs
          value={value}
          onValueChange={(next) => {
            handleValueChange(next);
            setValue(next);
          }}
        >
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    }

    render(<ControlledTabsHarness initialValue="tab1" />);

    // 초기 상태: Tab 1이 활성화되어 있음
    expect(screen.getByText('Content 1')).toBeDefined();

    // Tab 2 클릭
    await user.click(screen.getByText('Tab 2'));
    expect(handleValueChange).toHaveBeenCalledWith('tab2');

    // Tab 2 콘텐츠가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeDefined();
    });

    // Tab 2 트리거가 활성화되어 있는지 확인
    const tab2Trigger = screen.getByText('Tab 2');
    expect(tab2Trigger.getAttribute('data-state')).toBe('active');
  });

});

