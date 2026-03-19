"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Alert Props
interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  className?: string;
  icon?: React.ReactNode;
}

// Alert Component - Enhanced alert with variants
export function Alert({ 
  children, 
  variant = "default", 
  className, 
  icon 
}: AlertProps) {
  const variantClasses = {
    default: "border-border bg-background text-foreground",
    destructive: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    info: "border-blue-200 bg-blue-50 text-blue-800"
  };

  const defaultIcons = {
    default: <Info className="h-4 w-4" />,
    destructive: <XCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    info: <Info className="h-4 w-4" />
  };

  return (
    <Card className={cn(
      "border py-0",
      variantClasses[variant],
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-start space-x-2">
          <div className="mt-0.5">
            {icon || defaultIcons[variant]}
          </div>
          <div className="text-sm">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
