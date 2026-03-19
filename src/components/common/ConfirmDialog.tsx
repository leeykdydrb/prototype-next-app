"use client";

import React from "react";
import { Button } from "@/components/framework/form";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/framework/layout";
import { CheckCircle } from "lucide-react";

const DEFAULT_ICON = <CheckCircle className="h-5 w-5" />;

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content?: React.ReactNode;
  confirmText?: string;
  confirmButtonColor?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  cancelText?: string;
  icon?: React.ReactNode;
}

const ConfirmDialog = React.memo(function ConfirmDialog({
  open, 
  onClose, 
  onConfirm, 
  title = "확인",
  content = "정말로 이 작업을 진행하시겠습니까?",
  confirmText = "확인",
  confirmButtonColor = "default",
  cancelText = "취소",
  icon = DEFAULT_ICON,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader icon={icon} title={title} className="pb-0" />
        <DialogBody>
          {content}
        </DialogBody>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={confirmButtonColor} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default ConfirmDialog;