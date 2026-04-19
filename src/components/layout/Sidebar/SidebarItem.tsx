'use client'

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useNavMenuTitle } from "@/hooks/menu/useNavMenuTitle";
import type { MenuTree } from "@/types/menu";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/framework/layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/framework/collapsible";
import {
  ChevronRight,
  Code,
  FileChartColumn,
  LayoutDashboardIcon,
  Menu,
  MonitorCog,
  Settings,
  Shield,
  Users,
  UserCog,
  Wrench
} from "lucide-react";

interface SidebarItemProps {
  item: MenuTree;
  isActive: boolean;
}

// 아이콘 매핑 객체
const iconMap: Record<string, React.ComponentType> = {
  Dashboard: () => <LayoutDashboardIcon />,
  Engineering: () => <Wrench />,
  Assessment: () => <FileChartColumn />,
  Settings: () => <Settings />,
  SystemSettings: () => <MonitorCog />,
  People: () => <UserCog />,
  Code: () => <Code />,
  Security: () => <Shield />,
  Groups: () => <Users />,
  Menu: () => <Menu />
};

export default function SidebarItem({ 
  item, 
  isActive
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navTitle = useNavMenuTitle();
  const [open, setOpen] = useState(false);

  const hasChildren = Boolean(item.children?.length);
  const isParentActive = hasChildren && item.children?.some(child => 
    pathname === child.path || 
    pathname.startsWith(`${child.path}/`)
  );

  const Icon = iconMap[item.icon || ''] || (() => <div className="w-4 h-4 bg-gray-400 rounded" />);

  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  const handleItemClick = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  if (hasChildren) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="w-full justify-start cursor-pointer"
              isActive={isActive || isParentActive}
            >
              <Icon />
              <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                {navTitle(item)}
              </span>
              <ChevronRight className={cn(
                "ml-auto h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden",
                open && "rotate-90"
              )} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuSub>
              {item.children?.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    isActive={pathname === child.path}
                    onClick={() => child.path && handleItemClick(child.path)}
                  >
                    <span>{navTitle(child)}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} onClick={() => item.path && handleItemClick(item.path)}>
        <Icon />
        <span className="group-data-[collapsible=icon]:hidden">{navTitle(item)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}