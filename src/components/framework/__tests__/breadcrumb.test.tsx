/**
 * Breadcrumb 컴포넌트 테스트 파일
 * 
 * Breadcrumb 컴포넌트는 네비게이션 경로를 표시하는 브레드크럼 기능을 제공하는 컴포넌트입니다.
 * 이 테스트는 Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../layout/breadcrumb';

describe('Breadcrumb', () => {
  /**
   * Breadcrumb의 className이 올바르게 적용되는지 테스트
   */
  it('should apply className to breadcrumb', () => {
    const { container } = render(
      <Breadcrumb className="custom-breadcrumb-class">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const breadcrumb = container.querySelector('nav');
    expect(breadcrumb?.className).toContain('custom-breadcrumb-class');
  });
});

describe('BreadcrumbList', () => {
  /**
   * BreadcrumbList가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render breadcrumb list with children and className', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList className="custom-list-class">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">About</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    const list = container.querySelector('ol');
    expect(list?.className).toContain('custom-list-class');
  });
});

describe('BreadcrumbItem', () => {
  /**
   * BreadcrumbItem이 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render breadcrumb item with children and className', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="custom-item-class">
            <BreadcrumbPage>Item</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Item')).toBeDefined();
    const item = container.querySelector('li');
    expect(item?.className).toContain('custom-item-class');
  });

});

describe('BreadcrumbLink', () => {
  /**
   * BreadcrumbLink가 올바르게 렌더링되고 href와 className이 적용되는지 테스트
   */
  it('should render breadcrumb link with href and className', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home" className="custom-link-class">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const link = screen.getByText('Home').closest('a');
    expect(link?.getAttribute('href')).toBe('/home');
    expect(link?.className).toContain('custom-link-class');
  });

});

describe('BreadcrumbPage', () => {
  /**
   * BreadcrumbPage가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render breadcrumb page with children and className', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="custom-page-class">
              Current Page
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Current Page')).toBeDefined();
    const page = container.querySelector('span');
    expect(page?.className).toContain('custom-page-class');
  });

});

describe('BreadcrumbSeparator', () => {
  /**
   * BreadcrumbSeparator가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render breadcrumb separator with className', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="custom-separator-class" />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Current')).toBeDefined();
    const separator = container.querySelector('li[aria-hidden="true"]');
    expect(separator).toBeDefined();
    expect(separator?.className).toContain('custom-separator-class');
  });

  /**
   * BreadcrumbSeparator가 커스텀 children을 렌더링할 수 있는지 테스트
   */
  it('should render breadcrumb separator with custom children', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('/')).toBeDefined();
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Breadcrumb Complex Scenarios', () => {
  /**
   * 완전한 브레드크럼 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Breadcrumb 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete breadcrumb structure', () => {
    render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbList className="custom-list">
          <BreadcrumbItem className="custom-item">
            <BreadcrumbLink href="/" className="custom-link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="custom-separator" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" className="custom-link">
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="custom-page">Current Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('Current Product')).toBeDefined();
  });

  /**
   * BreadcrumbSeparator 없이도 브레드크럼이 작동하는지 테스트
   * - Separator 없이도 아이템들이 렌더링되는지 확인
   */
  it('should render breadcrumb without separators', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Current')).toBeDefined();
  });
});

