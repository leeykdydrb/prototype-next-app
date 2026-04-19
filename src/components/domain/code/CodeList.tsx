"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/framework/form";
import { 
  Code as CodeIcon,
  Trash2 as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  ToggleLeft as ToggleOffIcon,
  ToggleRight as ToggleOnIcon,
  AlertTriangle as WarningIcon,
} from "lucide-react";
import type { CodeListProps, CodeData } from "@/types/code";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useTranslations } from "next-intl";

const CodeList = React.memo(function CodeList({
  codes,
  onEdit,
  onDelete,
  onToggle,
}: CodeListProps) {
  const tConfirm = useTranslations("AdminCodes.dialogs.confirm");
  const tActions = useTranslations("AdminCodes.actions");
  const tEmpty = useTranslations("AdminCodes.empty");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    code: CodeData | null;
  }>({ open: false, code: null });

  const handleDeleteClick = (code: CodeData) => {
    setDeleteDialog({ open: true, code });
  };
    
  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.code) {
      onDelete(deleteDialog.code);
      setDeleteDialog(prev => ({ ...prev, open: false }));
    }
  }, [deleteDialog.code, onDelete]);
    
  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <div className="h-full overflow-auto px-2">
        <div className="space-y-0">
          {codes.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {tEmpty("codes")}
            </div>
          ) : (
            <>
              {codes.map((code) => (
                <div 
                  key={code.id}
                  className="flex items-center p-2 border-b hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <CodeIcon 
                      className={`h-4 w-4 mr-3 flex-shrink-0 ${
                        code.isActive ? 'text-primary' : 'text-muted-foreground'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{code.codeName}</span>
                        {code.isSystem && <LockIcon className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{code.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(code);
                      }}
                      disabled={code.isSystem}
                    >
                      {code.isActive ? (
                        <ToggleOnIcon className={`h-4 w-4 ${code.isSystem ? 'text-muted-foreground' : 'text-primary'}`} />
                      ) : (
                        <ToggleOffIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(code);
                      }}
                      disabled={code.isSystem}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(code);
                      }}
                      disabled={code.isSystem}
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={tConfirm("codeDeleteTitle")}
        content={
          <div className="space-y-2 text-left">
            <p>{tConfirm("codeDeleteQuestion", { name: deleteDialog.code?.codeName ?? "" })}</p>
            <p className="text-sm text-muted-foreground">
              {tConfirm("irreversible")}
            </p>
          </div>
        }
        confirmText={tActions("delete")}
        cancelText={tActions("cancel")}
        confirmButtonColor="destructive"
        icon={<WarningIcon className="h-5 w-5 text-warning" />}
      />
    </>
  );
});

export default CodeList;