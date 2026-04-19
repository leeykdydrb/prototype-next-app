'use client'

import React, { useMemo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, SidebarTrigger } from "@/components/framework/layout";
import { Separator } from "@/components/framework/data-display";
import { useNavMenuTitle } from "@/hooks/menu/useNavMenuTitle";
import LocaleMenu from "./LocaleMenu";
import ProfileMenu from "./ProfileMenu";
import type { MenuTree } from "@/types/menu";

interface HeaderProps {
  title?: string;
  menus: MenuTree[];
}

export default function AppHeader({ title = 'PROTOTYPE SYSTEM', menus }: HeaderProps) {
  const pathname = usePathname();
  const navTitle = useNavMenuTitle();

  // 현재 경로에 맞는 Breadcrumb 항목들 생성
  const breadcrumbItems = useMemo(() => {
    // 현재 경로에 맞는 메뉴 경로를 찾는 함수
    const findMenuPath = (menus: MenuTree[], targetPath: string): MenuTree[] => {
      for (const menu of menus) {
        if (menu.path === targetPath) {
          return [menu];
        }
        if (menu.children) {
          const childPath = findMenuPath(menu.children, targetPath);
          if (childPath.length > 0) {
            return [menu, ...childPath];
          }
        }
      }
      return [];
    };

    const menuPath = findMenuPath(menus, pathname);
    
    if (menuPath.length === 0) {
      // 메뉴에서 찾을 수 없는 경우 기본 Breadcrumb
      return [
        { title: title, path: null, isLast: true }
      ];
    }

    // 항상 첫 번째에 시스템 타이틀을 추가
    const breadcrumbItems = [
      { title: title, path: null, isLast: false },
      ...menuPath.map((menu, index) => {
        // 대메뉴에 path가 없는 경우, 첫 번째 하위 메뉴의 path 사용
        let linkPath = menu.path;
        if (!linkPath && menu.children && menu.children.length > 0) {
          linkPath = menu.children[0].path;
        }
        
        return {
          title: navTitle(menu),
          path: linkPath,
          isLast: index === menuPath.length - 1
        };
      })
    ];

    return breadcrumbItems;
  }, [menus, pathname, title, navTitle]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {item.isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : item.path ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.path}>{item.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground">{item.title}</span>
                )}
              </BreadcrumbItem>
              {!item.isLast && (
                <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* 우측 액션 버튼들 */}
      <div className="ml-auto flex items-center gap-2">
        <LocaleMenu />
        <ProfileMenu />
      </div>
    </header>
  )
}