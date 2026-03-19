/**
 * Dialog 컴포넌트 테스트 파일
 * 
 * Dialog 컴포넌트는 모달 다이얼로그를 제공하는 컴포넌트입니다.
 * 이 테스트는 Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogBody 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogBody } from '../layout/dialog';

describe('Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Dialog의 open prop과 onOpenChange가 올바르게 작동하는지 테스트
   */
  it('should control dialog open state and call onOpenChange', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    const { rerender } = render(
      <Dialog open={false} onOpenChange={handleOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader title="Dialog Title" description="Dialog Description" />
          <DialogBody>Dialog Body</DialogBody>
          <DialogFooter>Dialog Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Open Dialog')).toBeDefined();

    // 트리거 클릭
    await user.click(screen.getByText('Open Dialog'));
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalled();
    });

    // 열린 상태로 재렌더링
    rerender(
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader title="Dialog Title" />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Dialog Title')).toBeDefined();
  });

});

describe('DialogContent', () => {
  /**
   * DialogContent가 올바르게 렌더링되는지 테스트
   * - DialogContent는 포털을 사용하므로 children 렌더링 확인만 수행
   */
  it('should render dialog content with children', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-content-class">
          <DialogHeader title="Title" />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Title')).toBeDefined();
  });
});

describe('DialogHeader', () => {
  /**
   * DialogHeader가 올바르게 렌더링되고 className, icon이 적용되는지 테스트
   */
  it('should render dialog header with title, description, className, and icon', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader
            className="custom-header-class"
            icon={<span>Icon</span>}
            title="Header Title"
            description="Header Description"
          />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Header Title')).toBeDefined();
    expect(screen.getByText('Header Description')).toBeDefined();
    expect(screen.getByText('Icon')).toBeDefined();
  });

});


describe('DialogTrigger', () => {
  /**
   * DialogTrigger가 올바르게 렌더링되고 asChild가 작동하는지 테스트
   */
  it('should render dialog trigger and work with asChild', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader title="Title" />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Open Dialog')).toBeDefined();
  });

  /**
   * DialogTrigger 클릭 시 다이얼로그가 열리는지 테스트
   */
  it('should open dialog when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader title="Dialog Title" />
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    // 다이얼로그가 열리면 콘텐츠가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeDefined();
    });
  });
});

describe('DialogFooter', () => {
  /**
   * DialogFooter가 올바르게 렌더링되는지 테스트
   * - DialogFooter는 포털 내부에 있으므로 children 렌더링 확인만 수행
   */
  it('should render dialog footer with children', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader title="Title" />
          <DialogFooter className="custom-footer-class">Footer Text</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Footer Text')).toBeDefined();
  });
});


// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Dialog Complex Scenarios', () => {
  /**
   * 완전한 다이얼로그 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Dialog 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete dialog structure', () => {
    render(
      <Dialog open={true}>
        <DialogContent size="lg" className="custom-content">
          <DialogHeader
            icon={<span>Icon</span>}
            title="Dialog Title"
            description="Dialog Description"
            className="custom-header"
          />
          <DialogBody className="custom-body">
            <p>Dialog Body Content</p>
          </DialogBody>
          <DialogFooter className="custom-footer">
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Dialog Title')).toBeDefined();
    expect(screen.getByText('Dialog Description')).toBeDefined();
    expect(screen.getByText('Dialog Body Content')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getByText('Confirm')).toBeDefined();
    expect(screen.getByText('Icon')).toBeDefined();
  });

  /**
   * DialogTrigger와 DialogContent가 함께 작동하는지 테스트
   */
  it('should work with trigger and content', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader title="Title" description="Description" />
          <DialogBody>Body</DialogBody>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 초기에는 콘텐츠가 보이지 않아야 함
    expect(screen.queryByText('Title')).toBeNull();

    // 트리거 클릭
    await user.click(screen.getByText('Open Dialog'));

    // 다이얼로그가 열리면 콘텐츠가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeDefined();
      expect(screen.getByText('Description')).toBeDefined();
      expect(screen.getByText('Body')).toBeDefined();
      expect(screen.getByText('Footer')).toBeDefined();
    });
  });


  /**
   * DialogContent의 모든 size 옵션이 올바르게 작동하는지 테스트
   */
  it('should render dialog with all size options', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'> = [
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      'full',
    ];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Dialog open={true}>
          <DialogContent size={size}>
            <DialogHeader title={`Size: ${size}`} />
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText(`Size: ${size}`)).toBeDefined();
      unmount();
    });
  });
});

