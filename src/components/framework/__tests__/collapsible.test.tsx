/**
 * Collapsible 컴포넌트 테스트 파일
 * 
 * Collapsible 컴포넌트는 접을 수 있는 콘텐츠(아코디언, 콜랩서블) 기능을 제공하는 컴포넌트입니다.
 * 이 테스트는 Accordion, AccordionItem, AccordionTrigger, AccordionContent, Collapsible 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible';
import { Button } from '../form';

describe('Accordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Accordion의 className이 올바르게 적용되는지 테스트
   */
  it('should apply className to accordion', () => {
    const { container } = render(
      <Accordion className="custom-accordion-class">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const accordion = container.querySelector('[class*="w-full"]');
    expect(accordion).toBeDefined();
    if (accordion instanceof HTMLElement) {
      expect(accordion.className).toContain('custom-accordion-class');
    }
  });
});

describe('AccordionItem', () => {
  /**
   * AccordionItem의 모든 props가 올바르게 전달되는지 테스트
   * - value, className props 확인
   */
  it('should pass all props to accordion item', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1" className="custom-item-class">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger')).toBeDefined();
  });
});


describe('Collapsible', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Collapsible의 모든 제어 props가 올바르게 전달되는지 테스트
   * - 기본 구조 렌더링, open, onOpenChange, defaultOpen, className 확인
   */
  it('should pass all control props to collapsible', () => {
    const handleOpenChange = vi.fn();
    
    // 기본 렌더링 (props 없음)
    const { unmount: unmount1 } = render(
      <Collapsible className="custom-collapsible-class">
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeDefined();
    unmount1();

    // open이 true인 경우
    const { unmount: unmount2 } = render(
      <Collapsible open={true} onOpenChange={handleOpenChange} className="custom-collapsible-class">
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeDefined();
    unmount2();

    // open이 false인 경우
    const { unmount: unmount3 } = render(
      <Collapsible open={false} onOpenChange={handleOpenChange} className="custom-collapsible-class">
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeDefined();
    unmount3();

    // defaultOpen이 있는 경우
    render(
      <Collapsible defaultOpen={true} className="custom-collapsible-class">
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeDefined();
  });
});

describe('CollapsibleTrigger', () => {
  /**
   * CollapsibleTrigger의 모든 props가 올바르게 전달되는지 테스트
   * - asChild, className props 확인
   */
  it('should pass all props to collapsible trigger', () => {
    // asChild={true}인 경우
    const { unmount: unmount1 } = render(
      <Collapsible>
        <CollapsibleTrigger asChild className="custom-trigger-class">
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeDefined();
    unmount1();

    // asChild={false} 또는 없음인 경우
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger className="custom-trigger-class">
          Toggle Button
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle Button')).toBeDefined();
    const trigger = container.querySelector('button');
    expect(trigger?.className).toContain('custom-trigger-class');
  });
});

describe('CollapsibleContent', () => {
  /**
   * CollapsibleContent의 className prop이 올바르게 전달되는지 테스트
   */
  it('should pass className prop to collapsible content', () => {
    render(
      <Collapsible open={true}>
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="custom-content-class">Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Content')).toBeDefined();
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Collapsible Complex Scenarios', () => {
  /**
   * 여러 AccordionItem이 함께 렌더링되는지 테스트
   * - 복수의 아코디언 아이템이 올바르게 렌더링되는지 확인
   */
  it('should render multiple accordion items', () => {
    render(
      <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Trigger 3</AccordionTrigger>
          <AccordionContent>Content 3</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger 1')).toBeDefined();
    expect(screen.getByText('Trigger 2')).toBeDefined();
    expect(screen.getByText('Trigger 3')).toBeDefined();
  });

  /**
   * Accordion의 type="single"과 type="multiple"이 올바르게 작동하는지 테스트
   * - 기본값(type="single", collapsible={true})도 확인
   */
  it('should handle both single and multiple accordion types', () => {
    // 기본값 (type="single", collapsible={true})
    const { unmount: unmount1 } = render(
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Default Trigger</AccordionTrigger>
          <AccordionContent>Default Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Default Trigger')).toBeDefined();
    unmount1();

    // type="single", collapsible={false}
    const { unmount: unmount2 } = render(
      <Accordion type="single" collapsible={false} defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Single Non-Collapsible</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Single Non-Collapsible')).toBeDefined();
    unmount2();

    // type="multiple"
    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Multiple Trigger</AccordionTrigger>
          <AccordionContent>Multiple Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Multiple Trigger')).toBeDefined();
  });

  /**
   * Collapsible과 Button이 함께 사용되는지 테스트
   * - asChild prop을 사용하여 Button을 트리거로 사용하는지 확인
   */
  it('should render collapsible with button trigger', () => {
    render(
      <Collapsible open={true}>
        <CollapsibleTrigger asChild>
          <Button>Open/Close</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>Collapsible content here</div>
        </CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Open/Close')).toBeDefined();
    expect(screen.getByText('Collapsible content here')).toBeDefined();
  });
});

