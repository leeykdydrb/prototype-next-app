"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/framework/form";
import { Badge } from "@/components/framework/data-display";
import { 
  Folder as CategoryIcon,
  Trash2 as DeleteIcon,
  Edit as EditIcon,
  ChevronUp as ExpandLessIcon,
  ChevronDown as ExpandMoreIcon,
  Lock as LockIcon,
  ToggleLeft as ToggleOffIcon,
  ToggleRight as ToggleOnIcon,
  AlertTriangle as WarningIcon,
} from "lucide-react";
import type { CodeGroupListProps, CodeGroupData, CodeGroupTree } from "@/types/code-group";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const CodeGroupList = React.memo(function CodeGroupList({
  codeGroups,
  selectedCodeGroup,
  onSelectCodeGroup,
  onEdit,
  onDelete,
  onToggle,
}: CodeGroupListProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    codeGroup: CodeGroupData | null;
  }>({ open: false, codeGroup: null });

  // 트리 구조 렌더링을 위한 상태
  const [openGroupIds, setOpenGroupIds] = useState<number[]>([]);

  const handleToggleGroup = (groupId: number) => {
    setOpenGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  // 초기에 모든 그룹을 펼쳐놓기
  useEffect(() => {
    const allGroupIds = codeGroups.map(group => group.id);
    setOpenGroupIds(allGroupIds);
  }, [codeGroups]);

  const handleDeleteClick = (codeGroup: CodeGroupData) => {
    setDeleteDialog({ open: true, codeGroup });
  };
  
  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.codeGroup) {
      onDelete(deleteDialog.codeGroup);
      setDeleteDialog(prev => ({ ...prev, open: false }));
    }
  }, [deleteDialog.codeGroup, onDelete]);
  
  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  }, []);

  // 트리 구조로 코드 그룹 렌더링하는 재귀 함수
  const renderCodeGroupRows = (groupList: CodeGroupTree[], level = 0): React.ReactNode[] => {
    return groupList.flatMap((group) => {
      const hasChildren = Boolean(group.children?.length);
      const isOpen = openGroupIds.includes(group.id);
      const isSelected = selectedCodeGroup?.id === group.id;

      return (
        <React.Fragment key={group.id}>
          <div 
            className={`flex items-center p-2 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
              isSelected ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectCodeGroup(group)}
            style={{ paddingLeft: `${8 + level * 16}px` }}
          >
            <div className="flex items-center flex-1 min-w-0">
              <CategoryIcon 
                className={`h-4 w-4 mr-3 flex-shrink-0 ${
                  group.isActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{group.groupName}</span>
                  {group.isSystem && <LockIcon className="h-3 w-3 text-muted-foreground" />}
                  <Badge variant={group._count?.codes ? "default" : "secondary"}>
                    {group._count?.codes || 0}
                  </Badge>
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleGroup(group.id);
                      }}
                    >
                      {isOpen ? <ExpandLessIcon className="h-3 w-3" /> : <ExpandMoreIcon className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{group.groupCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(group);
                }}
                disabled={group.isSystem}
              >
                {group.isActive ? (
                  <ToggleOnIcon className={`h-4 w-4 ${group.isSystem ? 'text-muted-foreground' : 'text-primary'}`} />
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
                  onEdit(group);
                }}
                disabled={group.isSystem}
              >
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(group);
                }}
                disabled={group.isSystem || (group._count?.codes || 0) > 0}
              >
                <DeleteIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {hasChildren && isOpen && group.children && renderCodeGroupRows(group.children, level + 1)}
        </React.Fragment>
      );
    });
  };
  
  return (
    <>
      <div className="h-full overflow-auto px-2">
        <div className="space-y-0">
          {renderCodeGroupRows(codeGroups)}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="코드 그룹 삭제"
        content={
          <div className="space-y-2 text-left">
            <p>
              <span className="font-semibold">
                {deleteDialog.codeGroup?.groupName}
              </span>
              {" 코드 그룹을 삭제하시겠습니까?"}
            </p>
            <p className="text-sm text-muted-foreground">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        }
        confirmText="삭제"
        confirmButtonColor="destructive"
        icon={<WarningIcon className="h-5 w-5 text-warning" />}
      />
    </>
  );
});

export default CodeGroupList;