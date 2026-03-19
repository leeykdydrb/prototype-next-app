# 마이그레이션 현황

## ✅ 완료된 파일

### Phase 1: 핵심 컴포넌트
- ✅ `src/components/domain/user/UserDialog.tsx`
- ✅ `src/components/domain/code/CodeForm.tsx`
- ✅ `src/components/domain/user/UserList.tsx`

## 📋 마이그레이션 대기 중인 파일

### Dialog 컴포넌트 (6개)
- [ ] `src/components/domain/role/RoleDialog.tsx`
- [ ] `src/components/domain/permission/PermissionDialog.tsx`
- [ ] `src/components/domain/menu/MenuDialog.tsx`
- [ ] `src/components/domain/code/CodeDialog.tsx`
- [ ] `src/components/domain/code/CodeGroupDialog.tsx`
- [ ] `src/components/domain/device/DeviceDialog.tsx`

### List 컴포넌트 (5개)
- [ ] `src/components/domain/code/CodeList.tsx`
- [ ] `src/components/domain/role/RoleList.tsx`
- [ ] `src/components/domain/permission/PermissionList.tsx`
- [ ] `src/components/domain/menu/MenuList.tsx`
- [ ] `src/components/domain/device/DeviceList.tsx`

### Form 컴포넌트 (1개)
- [ ] `src/components/domain/equipment/EquipmentCreateForm.tsx`

### Dashboard 컴포넌트 (5개)
- [ ] `src/components/domain/dashboard/SystemGraphs.tsx` (일부 완료)
- [ ] `src/components/domain/dashboard/OnDeviceList.tsx`
- [ ] `src/components/domain/dashboard/LightingStatus.tsx`
- [ ] `src/components/domain/dashboard/DetectionModelStatus.tsx`
- [ ] `src/components/domain/dashboard/CameraStatus.tsx`

### DeviceControl 컴포넌트 (4개)
- [ ] `src/components/domain/devicecontrol/CameraControl.tsx`
- [ ] `src/components/domain/devicecontrol/LightingControl.tsx`
- [ ] `src/components/domain/devicecontrol/OnDeviceList.tsx`
- [ ] `src/components/domain/devicecontrol/AppliedValues.tsx`

### Table Columns (4개)
- [ ] `src/components/domain/menu/table/columns.tsx`
- [ ] `src/components/domain/device/table/columns.tsx`
- [ ] `src/components/domain/role/table/columns.tsx`
- [ ] `src/components/domain/permission/table/columns.tsx`

### 기타 (2개)
- [ ] `src/components/domain/dashboard/DashboardTabs.tsx`
- [ ] `src/components/domain/code/CodeGroupList.tsx`

## 📊 통계

- **완료**: 3개 파일
- **대기**: 27개 파일
- **진행률**: 10%

## 🔄 마이그레이션 방법

각 파일은 `MIGRATION_GUIDE.md`의 패턴을 따라 마이그레이션하세요.

### 빠른 마이그레이션 스크립트 (참고용)

```bash
# 1. 파일 찾기
grep -r "from '@/components/framework" src/components/domain

# 2. 각 파일을 수동으로 마이그레이션
# - Import 문 변경
# - 컴포넌트 사용 변경
# - 테스트
```

