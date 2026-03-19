'use client'

import React from "react";
import { usePathname } from "next/navigation";
import type { MenuTree } from "@/types/menu";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu } from "@/components/framework/layout";
import LogoCi from "@/components/common/LogoCi";
import SidebarItem from "./SidebarItem";

export default function AppSidebar({ menus }: { menus: MenuTree[] }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r h-screen">
      <SidebarHeader className="border-b h-16">
        <div className="flex items-center h-full px-2 group-data-[collapsible=icon]:hidden"><LogoCi /></div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu) => (
                <SidebarItem
                  key={menu.id}
                  item={menu}
                  isActive={pathname === menu.path || pathname.startsWith(`${menu.path}/`)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}