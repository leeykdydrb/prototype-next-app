"use client";

import React from "react";
import {
  Command as BaseCommand,
  CommandDialog as BaseCommandDialog,
  CommandEmpty as BaseCommandEmpty,
  CommandGroup as BaseCommandGroup,
  CommandInput as BaseCommandInput,
  CommandItem as BaseCommandItem,
  CommandList as BaseCommandList,
  CommandSeparator as BaseCommandSeparator,
  CommandShortcut as BaseCommandShortcut
} from "@/components/ui/command";

interface CommandProps {
  children: React.ReactNode;
  className?: string;
}

// Command Component
export function Command({ 
  children, 
  className 
}: CommandProps) {
  return (
    <BaseCommand className={className}>
      {children}
    </BaseCommand>
  );
}

// Command Dialog Props
interface CommandDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Command Dialog Component
export function CommandDialog({ 
  children, 
  open, 
  onOpenChange 
}: CommandDialogProps) {
  return (
    <BaseCommandDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseCommandDialog>
  );
}

// Command Empty Props
interface CommandEmptyProps {
  children: React.ReactNode;
}

// Command Empty Component
export function CommandEmpty({ 
  children 
}: CommandEmptyProps) {
  return (
    <BaseCommandEmpty>
      {children}
    </BaseCommandEmpty>
  );
}

// Command Group Props
interface CommandGroupProps {
  children: React.ReactNode;
  heading?: string;
}

// Command Group Component
export function CommandGroup({ 
  children, 
  heading 
}: CommandGroupProps) {
  return (
    <BaseCommandGroup heading={heading}>
      {children}
    </BaseCommandGroup>
  );
}

// Command Input Props
interface CommandInputProps {
  placeholder?: string;
}

// Command Input Component
export function CommandInput({ 
  placeholder 
}: CommandInputProps) {
  return (
    <BaseCommandInput placeholder={placeholder} />
  );
}

// Command Item Props
interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

// Command Item Component
export function CommandItem({ 
  children, 
  onSelect,
  value,
  disabled = false 
}: CommandItemProps) {
  return (
    <BaseCommandItem onSelect={onSelect} value={value} disabled={disabled}>
      {children}
    </BaseCommandItem>
  );
}

// Command List Props
interface CommandListProps {
  children: React.ReactNode;
}

// Command List Component
export function CommandList({ 
  children 
}: CommandListProps) {
  return (
    <BaseCommandList>
      {children}
    </BaseCommandList>
  );
}

// Command Separator Component
export function CommandSeparator() {
  return <BaseCommandSeparator />;
}

// Command Shortcut Props
interface CommandShortcutProps {
  children: React.ReactNode;
}

// Command Shortcut Component
export function CommandShortcut({ 
  children 
}: CommandShortcutProps) {
  return (
    <BaseCommandShortcut>
      {children}
    </BaseCommandShortcut>
  );
}
