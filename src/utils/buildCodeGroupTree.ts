import type { CodeGroupTree } from "@/types/code-group";

export function buildCodeGroupTree(codeGroups: CodeGroupTree[]): CodeGroupTree[] {
  const codeGroupMap = new Map<number, CodeGroupTree>();
  const rootCodeGroups: CodeGroupTree[] = [];

  // 모든 코드 그룹을 맵에 추가
  codeGroups.forEach(codeGroup => {
    codeGroupMap.set(codeGroup.id, { ...codeGroup, children: [] });
  });

  // 부모-자식 관계 설정
  codeGroups.forEach(codeGroup => {
    const treeCodeGroup = codeGroupMap.get(codeGroup.id)!;
    
    if (codeGroup.parentId) {
      const parent = codeGroupMap.get(codeGroup.parentId);
      if (parent) {
        parent.children!.push(treeCodeGroup);
      }
    } else {
      rootCodeGroups.push(treeCodeGroup);
    }
  });

  return rootCodeGroups;
} 