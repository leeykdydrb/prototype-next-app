"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/framework/form";

interface ContentHeaderProps {
  icon: React.ReactNode;
  title: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  actionIcon?: React.ReactNode;
  actionLabel?: string;
  actionSize?: "sm" | "lg";
  onAction?: () => void;
  className?: string;
}

export default function ContentHeader({
  icon,
  title,
  titleSize = "2xl",
  actionIcon,
  actionLabel,
  actionSize = "lg",
  onAction,
  className
}: ContentHeaderProps) {
  const titleSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl"
  };

  return (
    <div className={cn("w-full flex justify-between items-center mb-6", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h1 className={cn(titleSizeClasses[titleSize], "font-semibold")}>{title}</h1>
      </div>
      {actionLabel && 
        <Button onClick={onAction} size={actionSize}>
          {actionIcon}
          {actionLabel}
        </Button>
      }
    </div>
  );
}

