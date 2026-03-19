/**
 * Card 컴포넌트 테스트 파일
 * 
 * Card 컴포넌트는 카드 형태의 컨테이너를 제공하는 컴포넌트입니다.
 * 이 테스트는 Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../layout/card';

describe('Card', () => {
  /**
   * Card의 className과 variant가 올바르게 적용되는지 테스트
   */
  it('should apply className and variant to card', () => {
    const variants: Array<'default' | 'outlined' | 'elevated'> = ['default', 'outlined', 'elevated'];
    
    variants.forEach((variant) => {
      const { container, unmount } = render(
        <Card variant={variant} className="custom-card-class">
          <CardContent>Content</CardContent>
        </Card>
      );
      const card = container.querySelector('[data-slot="card"]') || container.firstChild;
      expect(card).toBeDefined();
      if (card instanceof HTMLElement) {
        expect(card.className).toContain('custom-card-class');
        if (variant === 'default') {
          expect(card.className).toContain('border');
        } else if (variant === 'outlined') {
          expect(card.className).toContain('border-2');
        } else if (variant === 'elevated') {
          expect(card.className).toContain('shadow-lg');
        }
      }
      unmount();
    });
  });
});

describe('CardHeader', () => {
  /**
   * CardHeader가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render card header with title, description, and className', () => {
    const { container } = render(
      <Card>
        <CardHeader className="custom-header-class" title="Header Title" description="Header Description" />
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Header Title')).toBeDefined();
    expect(screen.getByText('Header Description')).toBeDefined();
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeDefined();
    if (header instanceof HTMLElement) {
      expect(header.className).toContain('custom-header-class');
    }
  });

  /**
   * CardHeader의 titleSize prop이 올바르게 적용되는지 테스트
   * - 모든 titleSize 옵션 확인
   */
  it('should apply titleSize classes to card header title', () => {
    const titleSizes: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'> = [
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
    ];

    titleSizes.forEach((size) => {
      const { unmount } = render(
        <Card>
          <CardHeader title="Title" titleSize={size} />
          <CardContent>Content</CardContent>
        </Card>
      );
      const title = screen.getByText('Title');
      expect(title).toBeDefined();
      const sizeClass = size === 'sm' ? 'text-sm' : 
                       size === 'md' ? 'text-base' : 
                       size === 'lg' ? 'text-lg' : 
                       size === 'xl' ? 'text-xl' : 
                       size === '2xl' ? 'text-2xl' : 'text-3xl';
      expect(title.className).toContain(sizeClass);
      unmount();
    });
  });

  /**
   * CardHeader의 titleSize와 titleClassName이 올바르게 적용되는지 테스트
   */
  it('should apply titleSize and titleClassName to card header title', () => {
    render(
      <Card>
        <CardHeader title="Title" titleSize="lg" titleClassName="custom-title-class" />
        <CardContent>Content</CardContent>
      </Card>
    );
    const title = screen.getByText('Title');
    expect(title.className).toContain('text-lg');
    expect(title.className).toContain('custom-title-class');
  });

  /**
   * CardHeader의 align prop이 올바르게 적용되는지 테스트
   * - 모든 align 옵션 확인
   */
  it('should apply align classes to card header', () => {
    const aligns: Array<'start' | 'between' | 'center' | 'end'> = [
      'start',
      'between',
      'center',
      'end',
    ];

    aligns.forEach((align) => {
      const { container, unmount } = render(
        <Card>
          <CardHeader title="Title" align={align} />
          <CardContent>Content</CardContent>
        </Card>
      );
      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toBeDefined();
      if (header instanceof HTMLElement) {
        const alignClass = align === 'start' ? 'justify-start' :
                           align === 'between' ? 'justify-between' :
                           align === 'center' ? 'justify-center' : 'justify-end';
        expect(header.querySelector('div')?.className).toContain(alignClass);
      }
      unmount();
    });
  });

  /**
   * CardHeader의 align과 gap이 올바르게 적용되는지 테스트
   */
  it('should apply align and gap to card header', () => {
    const { container } = render(
      <Card>
        <CardHeader title="Title" align="start" gap={4} />
        <CardContent>Content</CardContent>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeDefined();
    if (header instanceof HTMLElement) {
      expect(header.querySelector('div')?.className).toContain('justify-start');
      expect(header.querySelector('div')?.className).toContain('gap-4');
    }
  });

  /**
   * CardHeader의 children이 올바르게 렌더링되는지 테스트
   */
  it('should render card header with children', () => {
    render(
      <Card>
        <CardHeader title="Title">
          <button>Action</button>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Action')).toBeDefined();
  });
});

describe('CardContent', () => {
  /**
   * CardContent가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render card content with children and className', () => {
    const { container } = render(
      <Card>
        <CardContent className="custom-content-class">Content Text</CardContent>
      </Card>
    );
    expect(screen.getByText('Content Text')).toBeDefined();
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeDefined();
    if (content instanceof HTMLElement) {
      expect(content.className).toContain('custom-content-class');
    }
  });
});

describe('CardFooter', () => {
  /**
   * CardFooter가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render card footer with children and className', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter className="custom-footer-class">Footer Text</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer Text')).toBeDefined();
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toBeDefined();
    if (footer instanceof HTMLElement) {
      expect(footer.className).toContain('custom-footer-class');
    }
  });
});

describe('CardTitle', () => {
  /**
   * CardTitle이 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render card title with className', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle className="custom-title-class">Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    const title = screen.getByText('Title');
    expect(title).toBeDefined();
    expect(title.className).toContain('custom-title-class');
  });
});

describe('CardDescription', () => {
  /**
   * CardDescription이 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render card description with className', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription className="custom-description-class">
            Description
          </CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    const description = screen.getByText('Description');
    expect(description).toBeDefined();
    expect(description.className).toContain('custom-description-class');
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Card Complex Scenarios', () => {
  /**
   * 완전한 카드 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Card 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete card structure', () => {
    render(
      <Card variant="elevated" className="custom-card">
        <CardHeader
          title="Card Title"
          description="Card Description"
          titleSize="xl"
          align="center"
          gap={2}
          className="custom-header"
        >
          <button>Action</button>
        </CardHeader>
        <CardContent className="custom-content">
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="custom-footer">
          <button>Footer Button</button>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeDefined();
    expect(screen.getByText('Card Description')).toBeDefined();
    expect(screen.getByText('Card Content')).toBeDefined();
    expect(screen.getByText('Footer Button')).toBeDefined();
    expect(screen.getByText('Action')).toBeDefined();
  });

});

