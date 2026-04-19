'use client'

import React, { useEffect } from "react";
import AppHeader from "@/components/layout/Header/AppHeader";
import AppSidebar from "@/components/layout/Sidebar/AppSidebar";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { SidebarInset, SidebarProvider } from "@/components/framework/layout";

import { useMenuQuery } from "@/hooks/menu/useMenuQuery";
import { useMenuStore } from "@/store/menuStore";
import { buildMenuTree } from "@/utils/buildMenuTree";
import { useTranslations } from "next-intl";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common");
  const { setMenus } = useMenuStore();

  const { data, isLoading, error } = useMenuQuery({ isActive: true });

  useEffect(() => {
    if (data) setMenus(data);
  }, [data, setMenus]);

  if (isLoading) return <Loading message={t("loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  const menus = buildMenuTree(data ?? []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        
        {/* 사이드바 */}
        <AppSidebar menus={menus} />

        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {/* 헤더 */}
          <AppHeader title="MICUBE SOLUTION SYSTEM" menus={menus} />
          {/* 메인 콘텐츠 */}
          <main className="flex-1 p-2 overflow-auto">
            {children}
          </main>
        </SidebarInset>
        
      </div>
    </SidebarProvider>
  )
}
