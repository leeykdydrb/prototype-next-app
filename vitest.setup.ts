import { vi } from 'vitest';
import React from 'react';

// Pointer Events API 폴리필 (happy-dom에서 hasPointerCapture 지원)
// Radix UI Select 컴포넌트가 이 메서드들을 사용하므로 폴리필 필요
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = function(): boolean {
      return false;
    } as typeof Element.prototype.hasPointerCapture;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function(): void {
      // No-op
    } as typeof Element.prototype.setPointerCapture;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function(): void {
      // No-op
    } as typeof Element.prototype.releasePointerCapture;
  }
}

// Next.js 모킹
vi.mock('next/navigation', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  };

  return {
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Next.js Image 컴포넌트 모킹
// 실제 Next.js Image 컴포넌트를 사용하되, 테스트 환경에 맞게 설정
vi.mock('next/image', async () => {
  const actual = await vi.importActual('next/image');
  return {
    ...actual,
    default: (props: React.ComponentPropsWithoutRef<'img'> & { 
      priority?: boolean;
      loading?: 'lazy' | 'eager';
      unoptimized?: boolean;
    }) => {
      // Next.js Image 전용 props 제거 (priority, loading, unoptimized 등)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { priority: _priority, loading: _loading, unoptimized: _unoptimized, ...imgProps } = props;
      return React.createElement('img', imgProps);
    },
  };
});

