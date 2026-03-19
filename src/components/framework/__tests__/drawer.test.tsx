/**
 * Drawer 컴포넌트 테스트 파일
 * 
 * Drawer 컴포넌트는 모바일에서 사용되는 사이드 패널 형태의 드로어를 제공하는 컴포넌트입니다.
 * 이 테스트는 Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose
} from '../layout/drawer';

describe('Drawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Drawer의 open prop과 onOpenChange가 올바르게 작동하는지 테스트
   */
  it('should control drawer open state and call onOpenChange', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    const { rerender } = render(
      <Drawer open={false} onOpenChange={handleOpenChange}>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>Drawer Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Open Drawer')).toBeDefined();

    // 트리거 클릭
    await user.click(screen.getByText('Open Drawer'));
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalled();
    });

    // 열린 상태로 재렌더링
    rerender(
      <Drawer open={true} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Title')).toBeDefined();
  });
});

describe('DrawerContent', () => {
  /**
   * DrawerContent가 올바르게 렌더링되는지 테스트
   * - DrawerContent는 포털을 사용하므로 children 렌더링 확인만 수행
   */
  it('should render drawer content with children', () => {
    render(
      <Drawer open={true}>
        <DrawerContent className="custom-content-class">
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Title')).toBeDefined();
  });
});

describe('DrawerHeader', () => {
  /**
   * DrawerHeader가 올바르게 렌더링되는지 테스트
   * - DrawerHeader는 포털 내부에 있으므로 children 렌더링 확인만 수행
   */
  it('should render drawer header with children', () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerHeader className="custom-header-class">
            <DrawerTitle>Header Title</DrawerTitle>
            <DrawerDescription>Header Description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Header Title')).toBeDefined();
    expect(screen.getByText('Header Description')).toBeDefined();
  });
});

describe('DrawerTitle', () => {
  /**
   * DrawerTitle이 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render drawer title with className', () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="custom-title-class">Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const title = screen.getByText('Title');
    expect(title).toBeDefined();
    expect(title.className).toContain('custom-title-class');
  });
});

describe('DrawerDescription', () => {
  /**
   * DrawerDescription이 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render drawer description with className', () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription className="custom-description-class">
              Description
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const description = screen.getByText('Description');
    expect(description).toBeDefined();
    expect(description.className).toContain('custom-description-class');
  });
});

describe('DrawerTrigger', () => {
  /**
   * DrawerTrigger가 올바르게 렌더링되는지 테스트
   */
  it('should render drawer trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Open Drawer')).toBeDefined();
  });

  /**
   * DrawerTrigger 클릭 시 드로어가 열리는지 테스트
   */
  it('should open drawer when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    // 드로어가 열리면 콘텐츠가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('Drawer Title')).toBeDefined();
    });
  });
});

describe('DrawerFooter', () => {
  /**
   * DrawerFooter가 올바르게 렌더링되는지 테스트
   * - DrawerFooter는 포털 내부에 있으므로 children 렌더링 확인만 수행
   */
  it('should render drawer footer with children', () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter className="custom-footer-class">Footer Text</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Footer Text')).toBeDefined();
  });
});

describe('DrawerClose', () => {
  /**
   * DrawerClose가 올바르게 렌더링되는지 테스트
   */
  it('should render drawer close', () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Close')).toBeDefined();
  });

  /**
   * DrawerClose 클릭 시 드로어가 닫히는지 테스트
   */
  it('should close drawer when close is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Drawer open={true} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    // onOpenChange가 false로 호출되어야 함
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Drawer Complex Scenarios', () => {
  /**
   * 완전한 드로어 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Drawer 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete drawer structure', () => {
    render(
      <Drawer open={true}>
        <DrawerContent className="custom-content">
          <DrawerHeader className="custom-header">
            <DrawerTitle className="custom-title">Drawer Title</DrawerTitle>
            <DrawerDescription className="custom-description">
              Drawer Description
            </DrawerDescription>
            <DrawerClose>Close</DrawerClose>
          </DrawerHeader>
          <div>Drawer Body Content</div>
          <DrawerFooter className="custom-footer">
            <button>Cancel</button>
            <button>Confirm</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Drawer Title')).toBeDefined();
    expect(screen.getByText('Drawer Description')).toBeDefined();
    expect(screen.getByText('Drawer Body Content')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getByText('Confirm')).toBeDefined();
    expect(screen.getByText('Close')).toBeDefined();
  });

  /**
   * DrawerTrigger와 DrawerContent가 함께 작동하는지 테스트
   */
  it('should work with trigger and content', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
          <div>Body</div>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    // 초기에는 콘텐츠가 보이지 않아야 함
    expect(screen.queryByText('Title')).toBeNull();

    // 트리거 클릭
    await user.click(screen.getByText('Open Drawer'));

    // 드로어가 열리면 콘텐츠가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeDefined();
      expect(screen.getByText('Description')).toBeDefined();
      expect(screen.getByText('Body')).toBeDefined();
      expect(screen.getByText('Footer')).toBeDefined();
    });
  });


  /**
   * DrawerClose가 드로어를 닫는지 테스트
   */
  it('should close drawer when DrawerClose is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Drawer open={true} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // 초기에는 열려있어야 함
    expect(screen.getByText('Title')).toBeDefined();

    // Close 버튼 클릭
    await user.click(screen.getByText('Close'));

    // onOpenChange가 false로 호출되어야 함
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

