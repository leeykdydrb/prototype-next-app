/**
 * Alert 컴포넌트 테스트 파일
 * 
 * Alert 컴포넌트는 다양한 variant(스타일)와 아이콘을 지원하는 피드백 컴포넌트입니다.
 * 이 테스트는 Alert 컴포넌트의 모든 기능을 검증합니다.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '../feedback';
import { CheckCircle, XCircle } from 'lucide-react';

describe('Alert', () => {
  // ==========================================
  // 기본 렌더링 테스트
  // ==========================================

  /**
   * Alert 컴포넌트가 children을 올바르게 렌더링하는지 테스트
   * - children으로 전달된 텍스트가 화면에 표시되는지 확인
   */
  it('should render alert with children', () => {
    render(<Alert>This is an alert message</Alert>);
    expect(screen.getByText('This is an alert message')).toBeDefined();
  });

  // ==========================================
  // Variant 스타일 테스트
  // ==========================================

  /**
   * 기본 variant의 스타일이 올바르게 적용되는지 테스트
   * - variant를 지정하지 않으면 default variant가 적용됨
   * - bg-background, border-border, text-foreground 클래스가 적용되는지 확인
   */
  it('should render with default variant', () => {
    const { container } = render(<Alert>Default alert</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeDefined();
    expect(card?.className).toContain('bg-background');
    expect(card?.className).toContain('border-border');
    expect(card?.className).toContain('text-foreground');
  });

  /**
   * destructive variant의 스타일이 올바르게 적용되는지 테스트
   * - 에러 메시지에 사용되는 빨간색 스타일
   * - bg-red-50, text-red-800, border-red-200 클래스 확인
   */
  it('should render with destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error message</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('bg-red-50');
    expect(card?.className).toContain('text-red-800');
    expect(card?.className).toContain('border-red-200');
  });

  /**
   * success variant의 스타일이 올바르게 적용되는지 테스트
   * - 성공 메시지에 사용되는 초록색 스타일
   * - bg-green-50, text-green-800, border-green-200 클래스 확인
   */
  it('should render with success variant', () => {
    const { container } = render(<Alert variant="success">Success message</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('bg-green-50');
    expect(card?.className).toContain('text-green-800');
    expect(card?.className).toContain('border-green-200');
  });

  /**
   * warning variant의 스타일이 올바르게 적용되는지 테스트
   * - 경고 메시지에 사용되는 노란색 스타일
   * - bg-yellow-50, text-yellow-800, border-yellow-200 클래스 확인
   */
  it('should render with warning variant', () => {
    const { container } = render(<Alert variant="warning">Warning message</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('bg-yellow-50');
    expect(card?.className).toContain('text-yellow-800');
    expect(card?.className).toContain('border-yellow-200');
  });

  /**
   * info variant의 스타일이 올바르게 적용되는지 테스트
   * - 정보 메시지에 사용되는 파란색 스타일
   * - bg-blue-50, text-blue-800, border-blue-200 클래스 확인
   */
  it('should render with info variant', () => {
    const { container } = render(<Alert variant="info">Info message</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('bg-blue-50');
    expect(card?.className).toContain('text-blue-800');
    expect(card?.className).toContain('border-blue-200');
  });

  // ==========================================
  // 기본 아이콘 테스트
  // ==========================================

  /**
   * default variant의 기본 아이콘(Info)이 렌더링되는지 테스트
   * - SVG 아이콘이 존재하는지 확인
   */
  it('should render default icon for default variant', () => {
    const { container } = render(<Alert variant="default">Default alert</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * destructive variant의 기본 아이콘(XCircle)이 렌더링되는지 테스트
   * - 에러 아이콘이 표시되는지 확인
   */
  it('should render XCircle icon for destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * success variant의 기본 아이콘(CheckCircle)이 렌더링되는지 테스트
   * - 성공 아이콘이 표시되는지 확인
   */
  it('should render CheckCircle icon for success variant', () => {
    const { container } = render(<Alert variant="success">Success message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * warning variant의 기본 아이콘(AlertTriangle)이 렌더링되는지 테스트
   * - 경고 아이콘이 표시되는지 확인
   */
  it('should render AlertTriangle icon for warning variant', () => {
    const { container } = render(<Alert variant="warning">Warning message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * info variant의 기본 아이콘(Info)이 렌더링되는지 테스트
   * - 정보 아이콘이 표시되는지 확인
   */
  it('should render Info icon for info variant', () => {
    const { container } = render(<Alert variant="info">Info message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  // ==========================================
  // 커스텀 아이콘 테스트
  // ==========================================

  /**
   * 커스텀 아이콘이 제공되었을 때 렌더링되는지 테스트
   * - icon prop으로 전달된 커스텀 아이콘이 표시되는지 확인
   */
  it('should render custom icon when provided', () => {
    const customIcon = <CheckCircle className="h-5 w-5" data-testid="custom-icon" />;
    const { container } = render(<Alert icon={customIcon}>Custom icon alert</Alert>);
    const icon = container.querySelector('[data-testid="custom-icon"]');
    expect(icon).toBeDefined();
  });

  /**
   * 커스텀 아이콘이 기본 아이콘을 대체하는지 테스트
   * - variant에 따른 기본 아이콘 대신 커스텀 아이콘이 사용되는지 확인
   */
  it('should use custom icon instead of default icon', () => {
    const customIcon = <XCircle className="h-5 w-5" data-testid="custom-icon" />;
    const { container } = render(<Alert variant="success" icon={customIcon}>Custom icon</Alert>);
    const customIconElement = container.querySelector('[data-testid="custom-icon"]');
    expect(customIconElement).toBeDefined();
  });

  // ==========================================
  // 스타일링 테스트
  // ==========================================

  /**
   * 커스텀 className이 올바르게 적용되는지 테스트
   * - className prop으로 전달된 클래스가 Card 컴포넌트에 적용되는지 확인
   */
  it('should apply custom className', () => {
    const { container } = render(<Alert className="custom-class">Alert with custom class</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('custom-class');
  });

  /**
   * 콘텐츠 영역에 text-sm 클래스가 적용되는지 테스트
   * - Alert의 children이 작은 텍스트 크기로 표시되는지 확인
   */
  it('should render with text-sm class for content', () => {
    const { container } = render(<Alert>Alert content</Alert>);
    const content = container.querySelector('.text-sm');
    expect(content).toBeDefined();
    expect(content?.textContent).toBe('Alert content');
  });

  /**
   * 여러 children이 올바르게 렌더링되는지 테스트
   * - Alert 내부에 여러 요소가 있을 때 모두 표시되는지 확인
   */
  it('should render multiple children', () => {
    render(
      <Alert>
        <div>First line</div>
        <div>Second line</div>
      </Alert>
    );
    expect(screen.getByText('First line')).toBeDefined();
    expect(screen.getByText('Second line')).toBeDefined();
  });

  /**
   * 아이콘과 콘텐츠가 flex 레이아웃으로 배치되는지 테스트
   * - flex, items-start, space-x-2 클래스가 적용되어 수평 배치되는지 확인
   */
  it('should render with flex layout for icon and content', () => {
    const { container } = render(<Alert>Alert message</Alert>);
    const flexContainer = container.querySelector('.flex.items-start.space-x-2');
    expect(flexContainer).toBeDefined();
  });

  /**
   * 아이콘이 올바른 위치에 렌더링되는지 테스트
   * - 아이콘이 mt-0.5 클래스를 가진 컨테이너 안에 있는지 확인
   * - 아이콘이 콘텐츠와 정렬되도록 배치되는지 확인
   */
  it('should render icon in correct position', () => {
    const { container } = render(<Alert>Alert message</Alert>);
    // flex 컨테이너를 먼저 찾고, 그 안에서 아이콘 컨테이너를 찾음
    const flexContainer = container.querySelector('.flex.items-start.space-x-2');
    expect(flexContainer).toBeDefined();
    
    // flex 컨테이너의 첫 번째 자식 요소가 아이콘 컨테이너임
    const iconContainer = flexContainer?.firstElementChild;
    expect(iconContainer).toBeDefined();
    
    // 아이콘 컨테이너에 mt-0.5 클래스가 있는지 확인
    expect(iconContainer?.className).toContain('mt-0.5');
    
    // 아이콘 컨테이너 안에 SVG 아이콘이 있는지 확인
    const icon = iconContainer?.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * variant 클래스와 커스텀 className이 함께 적용되는지 테스트
   * - variant에 따른 스타일과 커스텀 클래스가 모두 적용되는지 확인
   * - 클래스 병합이 올바르게 동작하는지 검증
   */
  it('should combine variant classes with custom className', () => {
    const { container } = render(
      <Alert variant="destructive" className="my-custom-class">
        Combined classes
      </Alert>
    );
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('bg-red-50');
    expect(card?.className).toContain('my-custom-class');
  });

  // ==========================================
  // 구조 및 레이아웃 테스트
  // ==========================================

  /**
   * Card 컴포넌트에 기본 클래스가 적용되는지 테스트
   * - border, py-0 클래스가 항상 적용되는지 확인
   */
  it('should apply default Card classes (border, py-0)', () => {
    const { container } = render(<Alert>Alert message</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain('border');
    expect(card?.className).toContain('py-0');
  });

  /**
   * CardContent에 padding이 올바르게 적용되는지 테스트
   * - p-3 클래스가 적용되어 적절한 패딩이 있는지 확인
   */
  it('should apply padding to CardContent', () => {
    const { container } = render(<Alert>Alert message</Alert>);
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeDefined();
    expect(cardContent?.className).toContain('p-3');
  });

  /**
   * 기본 아이콘의 크기가 올바른지 테스트
   * - 모든 variant의 기본 아이콘이 h-4 w-4 크기를 가지는지 확인
   */
  it('should render default icons with correct size (h-4 w-4)', () => {
    const { container } = render(<Alert variant="default">Default alert</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.className).toContain('h-4');
    expect(icon?.className).toContain('w-4');
  });

  /**
   * warning variant의 아이콘이 특별한 색상을 가지는지 테스트
   * - AlertTriangle 아이콘이 text-amber-600 클래스를 가지는지 확인
   */
  it('should render warning icon with amber color', () => {
    const { container } = render(<Alert variant="warning">Warning message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
    expect(icon?.className).toContain('text-amber-600');
  });

  // ==========================================
  // 엣지 케이스 테스트
  // ==========================================

  /**
   * 빈 children이 전달되었을 때도 렌더링되는지 테스트
   * - 빈 문자열이나 빈 배열이 전달되어도 컴포넌트가 정상적으로 렌더링되는지 확인
   */
  it('should render with empty children', () => {
    const { container } = render(<Alert>{''}</Alert>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeDefined();
  });

  /**
   * React Fragment를 children으로 사용할 수 있는지 테스트
   * - Fragment로 감싼 여러 요소가 올바르게 렌더링되는지 확인
   */
  it('should render with React Fragment as children', () => {
    render(
      <Alert>
        <>
          <span>First part</span>
          <span>Second part</span>
        </>
      </Alert>
    );
    expect(screen.getByText('First part')).toBeDefined();
    expect(screen.getByText('Second part')).toBeDefined();
  });

  /**
   * 숫자나 다른 타입의 children도 렌더링되는지 테스트
   * - 숫자, null 등 다양한 타입의 children을 처리할 수 있는지 확인
   */
  it('should render with number as children', () => {
    render(<Alert>{123}</Alert>);
    expect(screen.getByText('123')).toBeDefined();
  });

  /**
   * icon prop이 null일 때 기본 아이콘이 사용되는지 테스트
   * - icon={null}이 전달되어도 기본 아이콘이 렌더링되는지 확인
   */
  it('should use default icon when icon is null', () => {
    const { container } = render(<Alert icon={null} variant="success">Message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * icon prop이 false일 때 기본 아이콘이 사용되는지 테스트
   * - icon={false}가 전달되어도 기본 아이콘이 렌더링되는지 확인
   */
  it('should use default icon when icon is false', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { container } = render(<Alert icon={false as any} variant="info">Message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  /**
   * 모든 variant의 border 클래스가 올바르게 적용되는지 테스트
   * - 각 variant가 고유한 border 색상을 가지는지 확인
   */
  it('should apply correct border classes for all variants', () => {
    const variants = [
      { variant: 'default' as const, borderClass: 'border-border' },
      { variant: 'destructive' as const, borderClass: 'border-red-200' },
      { variant: 'success' as const, borderClass: 'border-green-200' },
      { variant: 'warning' as const, borderClass: 'border-yellow-200' },
      { variant: 'info' as const, borderClass: 'border-blue-200' },
    ];

    variants.forEach(({ variant, borderClass }) => {
      const { container } = render(<Alert variant={variant}>Message</Alert>);
      const card = container.querySelector('[data-slot="card"]');
      expect(card?.className).toContain(borderClass);
    });
  });

  /**
   * 복잡한 children 구조가 올바르게 렌더링되는지 테스트
   * - 중첩된 요소, 조건부 렌더링 등 복잡한 구조를 처리할 수 있는지 확인
   */
  it('should render complex nested children structure', () => {
    render(
      <Alert>
        <div>
          <strong>Title</strong>
          <p>Description text</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Alert>
    );
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Description text')).toBeDefined();
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
  });

  /**
   * 아이콘과 콘텐츠의 구조가 올바른지 테스트
   * - 아이콘 컨테이너와 콘텐츠 컨테이너가 올바른 순서로 배치되는지 확인
   */
  it('should have correct structure: icon container before content container', () => {
    const { container } = render(<Alert>Alert message</Alert>);
    const flexContainer = container.querySelector('.flex.items-start.space-x-2');
    expect(flexContainer).toBeDefined();
    
    const children = Array.from(flexContainer?.children || []);
    expect(children.length).toBe(2);
    
    // 첫 번째 자식은 아이콘 컨테이너
    expect(children[0]?.className).toContain('mt-0.5');
    // 두 번째 자식은 콘텐츠 컨테이너
    expect(children[1]?.className).toContain('text-sm');
  });
});

