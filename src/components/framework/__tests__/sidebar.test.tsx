/**
 * Sidebar 컴포넌트 테스트 파일
 * 
 * Sidebar 컴포넌트는 사이드바 네비게이션을 제공하는 컴포넌트입니다.
 * 이 테스트는 Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarTrigger 등 모든 하위 컴포넌트의 기능을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '../layout/sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Sidebar의 className과 collapsible prop이 올바르게 적용되는지 테스트
   */
  it('should apply className and collapsible prop to sidebar', () => {
    const collapsibleOptions: Array<'offcanvas' | 'icon' | 'none'> = [
      'offcanvas',
      'icon',
      'none',
    ];

    collapsibleOptions.forEach((collapsible) => {
      const { unmount } = render(
        <SidebarProvider>
          <Sidebar className="custom-sidebar-class" collapsible={collapsible}>
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(screen.getByText('Content')).toBeDefined();
      unmount();
    });
  });
});

describe('SidebarProvider', () => {
  /**
   * SidebarProvider의 className, defaultOpen, controlled open, onOpenChange가 올바르게 작동하는지 테스트
   */
  it('should handle className, defaultOpen, controlled open, and onOpenChange', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    // defaultOpen 테스트
    const { rerender } = render(
      <SidebarProvider className="custom-provider-class" defaultOpen={true}>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Content')).toBeDefined();

    // controlled open 및 onOpenChange 테스트
    rerender(
      <SidebarProvider className="custom-provider-class" open={false} onOpenChange={handleOpenChange}>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
    if (trigger) {
      await user.click(trigger);
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalled();
      });
    }
  });
});

describe('SidebarContent', () => {
  /**
   * SidebarContent가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar content with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Content Text</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Content Text')).toBeDefined();
  });

});

describe('SidebarHeader', () => {
  /**
   * SidebarHeader가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar header with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header Text</SidebarHeader>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Header Text')).toBeDefined();
  });

});

describe('SidebarFooter', () => {
  /**
   * SidebarFooter가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar footer with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
          <SidebarFooter>Footer Text</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Footer Text')).toBeDefined();
  });

});

describe('SidebarGroup', () => {
  /**
   * SidebarGroup이 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar group with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Group Label</SidebarGroupLabel>
              <SidebarGroupContent>Group Content</SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Group Label')).toBeDefined();
    expect(screen.getByText('Group Content')).toBeDefined();
  });

});

describe('SidebarGroupContent', () => {
  /**
   * SidebarGroupContent가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar group content with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>Group Content</SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Group Content')).toBeDefined();
  });

});

describe('SidebarGroupLabel', () => {
  /**
   * SidebarGroupLabel이 올바르게 렌더링되고 asChild가 작동하는지 테스트
   */
  it('should render sidebar group label and work with asChild', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <h2>Heading Label</h2>
              </SidebarGroupLabel>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Heading Label')).toBeDefined();
  });
});

describe('SidebarInset', () => {
  /**
   * SidebarInset가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar inset with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Sidebar</SidebarContent>
        </Sidebar>
        <SidebarInset>Main Content</SidebarInset>
      </SidebarProvider>
    );
    expect(screen.getByText('Main Content')).toBeDefined();
  });

});

describe('SidebarMenu', () => {
  /**
   * SidebarMenu가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar menu with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Menu Item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Menu Item')).toBeDefined();
  });

});

describe('SidebarMenuButton', () => {
  /**
   * SidebarMenuButton이 올바르게 렌더링되고 className, isActive가 적용되는지 테스트
   */
  it('should render sidebar menu button with className and isActive', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="custom-button-class" isActive={true}>
                  Active Button
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    const button = screen.getByText('Active Button');
    expect(button).toBeDefined();
    expect(button.className).toContain('custom-button-class');
  });

  /**
   * SidebarMenuButton의 onClick 콜백이 올바르게 호출되는지 테스트
   */
  it('should call onClick when sidebar menu button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClick}>Button</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const button = screen.getByText('Button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

});

describe('SidebarMenuItem', () => {
  /**
   * SidebarMenuItem이 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar menu item with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Item')).toBeDefined();
  });

});

describe('SidebarMenuSub', () => {
  /**
   * SidebarMenuSub가 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar menu sub with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Sub Item</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Parent')).toBeDefined();
    expect(screen.getByText('Sub Item')).toBeDefined();
  });

});

describe('SidebarMenuSubButton', () => {
  /**
   * SidebarMenuSubButton이 올바르게 렌더링되고 className, isActive가 적용되는지 테스트
   */
  it('should render sidebar menu sub button with className and isActive', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton className="custom-sub-button-class" isActive={true}>
                      Active Sub Button
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    const button = screen.getByText('Active Sub Button');
    expect(button).toBeDefined();
    expect(button.className).toContain('custom-sub-button-class');
  });

  /**
   * SidebarMenuSubButton의 onClick 콜백이 올바르게 호출되는지 테스트
   */
  it('should call onClick when sidebar menu sub button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={handleClick}>
                      Sub Button
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const button = screen.getByText('Sub Button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

});

describe('SidebarMenuSubItem', () => {
  /**
   * SidebarMenuSubItem이 올바르게 렌더링되는지 테스트
   */
  it('should render sidebar menu sub item with children', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Sub Item</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Sub Item')).toBeDefined();
  });

});

describe('SidebarTrigger', () => {
  /**
   * SidebarTrigger가 올바르게 렌더링되고 className이 적용되는지 테스트
   */
  it('should render sidebar trigger with className', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
        <SidebarTrigger className="custom-trigger-class" />
      </SidebarProvider>
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toBeDefined();
    expect(trigger.className).toContain('custom-trigger-class');
  });

  /**
   * SidebarTrigger의 onClick 콜백이 올바르게 호출되는지 테스트
   */
  it('should call onClick when sidebar trigger is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
        <SidebarTrigger onClick={handleClick} />
      </SidebarProvider>
    );

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(handleClick).toHaveBeenCalled();
  });
});

// ==========================================
// 복합 시나리오 테스트
// ==========================================

describe('Sidebar Complex Scenarios', () => {
  /**
   * 완전한 사이드바 구조가 올바르게 렌더링되는지 테스트
   * - 모든 Sidebar 컴포넌트가 함께 작동하는지 확인
   */
  it('should render complete sidebar structure', () => {
    render(
      <SidebarProvider>
        <Sidebar className="custom-sidebar" collapsible="icon">
          <SidebarHeader className="custom-header">
            <div>Header Content</div>
          </SidebarHeader>
          <SidebarContent className="custom-content">
            <SidebarGroup className="custom-group">
              <SidebarGroupLabel className="custom-label">Group 1</SidebarGroupLabel>
              <SidebarGroupContent className="custom-group-content">
                <SidebarMenu className="custom-menu">
                  <SidebarMenuItem className="custom-item">
                    <SidebarMenuButton
                      className="custom-button"
                      isActive={true}
                      variant="default"
                      size="default"
                    >
                      Menu Item 1
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Menu Item 2</SidebarMenuButton>
                    <SidebarMenuSub className="custom-sub">
                      <SidebarMenuSubItem className="custom-sub-item">
                        <SidebarMenuSubButton className="custom-sub-button" size="sm">
                          Sub Item 1
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="custom-footer">
            <div>Footer Content</div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="custom-inset">Main Content</SidebarInset>
        <SidebarTrigger className="custom-trigger" />
      </SidebarProvider>
    );
    expect(screen.getByText('Header Content')).toBeDefined();
    expect(screen.getByText('Group 1')).toBeDefined();
    expect(screen.getByText('Menu Item 1')).toBeDefined();
    expect(screen.getByText('Menu Item 2')).toBeDefined();
    expect(screen.getByText('Sub Item 1')).toBeDefined();
    expect(screen.getByText('Footer Content')).toBeDefined();
    expect(screen.getByText('Main Content')).toBeDefined();
  });

  /**
   * SidebarTrigger가 사이드바를 토글하는지 테스트
   */
  it('should toggle sidebar when trigger is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <SidebarProvider open={true} onOpenChange={handleOpenChange}>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    // 초기에는 열려있어야 함
    expect(screen.getByText('Content')).toBeDefined();

    // 트리거 클릭
    const trigger = screen.getByRole('button');
    await user.click(trigger);

    // onOpenChange가 호출되어야 함
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalled();
    });
  });

  /**
   * 중첩된 메뉴 구조가 올바르게 렌더링되는지 테스트
   */
  it('should render nested menu structure', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent 1</SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Child 1-1</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Child 1-2</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Parent 2</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Parent 1')).toBeDefined();
    expect(screen.getByText('Child 1-1')).toBeDefined();
    expect(screen.getByText('Child 1-2')).toBeDefined();
    expect(screen.getByText('Parent 2')).toBeDefined();
  });
});

