// prisma/seed.ts
import { PrismaClient, Code, Role } from "~prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
  errorFormat: "pretty",
});

// 시드 데이터 상수
const SEED_DATA = {
  roles: [
    {
      name: 'ADMIN',
      displayName: '관리자',
      description: '시스템 전체 관리 권한',
      isSystem: true,
    },
    {
      name: 'MANAGER',
      displayName: '매니저',
      description: '설비 관리 권한',
      isSystem: false,
    },
    {
      name: 'USER',
      displayName: '사용자',
      description: '기본 사용자 권한',
      isSystem: false,
    },
  ],

  // 코드 그룹 정의
  codeGroups: [
    {
      groupCode: 'PERMISSION_CATEGORY',
      groupName: '권한 카테고리',
      description: '권한 분류를 위한 카테고리',
      isSystem: true,
      parentId: null,
    },
  ],

  // 권한 카테고리 코드 정의
  permissionCategoryCodes: [
    { code: 'DASHBOARD', codeName: '대시보드', sortOrder: 1, isSystem: true },
    { code: 'EQUIPMENT', codeName: '설비', sortOrder: 2, isSystem: true },
    { code: 'REPORTS', codeName: '보고서', sortOrder: 3, isSystem: true },
    { code: 'SETTING', codeName: '설정', sortOrder: 4, isSystem: true },
    { code: 'USER', codeName: '사용자', sortOrder: 5, isSystem: true },
    { code: 'CODE', codeName: '코드관리', sortOrder: 6, isSystem: true },
    { code: 'PERMISSION', codeName: '권한관리', sortOrder: 7, isSystem: true },
    { code: 'ROLE', codeName: '역할관리', sortOrder: 8, isSystem: true },
    { code: 'MENU', codeName: '메뉴관리', sortOrder: 9, isSystem: true },
    { code: 'DEVICE', codeName: '디바이스관리', sortOrder: 10, isSystem: false },
  ],
  
  permissions: [
    // 대시보드
    { name: 'dashboard.read', displayName: '대시보드 조회', categoryCode: 'DASHBOARD', isSystem: true },
    
    // 설비 관리
    { name: 'equipment.read', displayName: '설비 조회', categoryCode: 'EQUIPMENT', isSystem: true },
    { name: 'equipment.create', displayName: '설비 생성', categoryCode: 'EQUIPMENT', isSystem: true },
    { name: 'equipment.update', displayName: '설비 수정', categoryCode: 'EQUIPMENT', isSystem: true },
    { name: 'equipment.delete', displayName: '설비 삭제', categoryCode: 'EQUIPMENT', isSystem: true },
    
    // 보고서
    { name: 'reports.read', displayName: '보고서 조회', categoryCode: 'REPORTS', isSystem: true },
    { name: 'reports.create', displayName: '보고서 생성', categoryCode: 'REPORTS', isSystem: true },
    { name: 'reports.export', displayName: '보고서 내보내기', categoryCode: 'REPORTS', isSystem: true },

    // 장비 제어
    { name: 'device.control', displayName: '장비 제어', categoryCode: 'DEVICE', isSystem: false },
    
    // 디바이스 관리
    { name: 'device.read', displayName: '디바이스 조회', categoryCode: 'DEVICE', isSystem: false },

    // 설정
    { name: 'setting.read', displayName: '설정 조회', categoryCode: 'SETTING', isSystem: true },
    { name: 'setting.update', displayName: '설정 수정', categoryCode: 'SETTING', isSystem: true },

    // 사용자 관리 (관리자 전용)
    { name: 'user.read', displayName: '사용자 조회', categoryCode: 'USER', isSystem: true },
    { name: 'user.create', displayName: '사용자 생성', categoryCode: 'USER', isSystem: true },
    { name: 'user.update', displayName: '사용자 수정', categoryCode: 'USER', isSystem: true },
    { name: 'user.delete', displayName: '사용자 삭제', categoryCode: 'USER', isSystem: true },

    // 코드 (관리자 전용)
    { name: 'code.read', displayName: '코드 조회', categoryCode: 'CODE', isSystem: true },
    { name: 'code.create', displayName: '코드 생성', categoryCode: 'CODE', isSystem: true },
    { name: 'code.update', displayName: '코드 수정', categoryCode: 'CODE', isSystem: true },
    { name: 'code.delete', displayName: '코드 삭제', categoryCode: 'CODE', isSystem: true },
    
    // 권한 관리 (관리자 전용)
    { name: 'permission.read', displayName: '권한 조회', categoryCode: 'PERMISSION', isSystem: true },
    { name: 'permission.create', displayName: '권한 생성', categoryCode: 'PERMISSION', isSystem: true},
    { name: 'permission.update', displayName: '권한 수정', categoryCode: 'PERMISSION', isSystem: true},
    { name: 'permission.delete', displayName: '권한 삭제', categoryCode: 'PERMISSION', isSystem: true},
    
    // 역할 관리 (관리자 전용)
    { name: 'role.read', displayName: '역할 조회', categoryCode: 'ROLE', isSystem: true },
    { name: 'role.create', displayName: '역할 생성', categoryCode: 'ROLE', isSystem: true },
    { name: 'role.update', displayName: '역할 수정', categoryCode: 'ROLE', isSystem: true },
    { name: 'role.delete', displayName: '역할 삭제', categoryCode: 'ROLE', isSystem: true },
    
    // 메뉴 관리 (관리자 전용)
    { name: 'menu.read', displayName: '메뉴 조회', categoryCode: 'MENU', isSystem: true },
    { name: 'menu.create', displayName: '메뉴 생성', categoryCode: 'MENU', isSystem: true },
    { name: 'menu.update', displayName: '메뉴 수정', categoryCode: 'MENU', isSystem: true },
    { name: 'menu.delete', displayName: '메뉴 삭제', categoryCode: 'MENU', isSystem: true },
  ],

  menus: [
    { id: 1, title: '대시보드', titleKey: 'NavMenu.dashboard', path: '/dashboard', icon: 'Dashboard', order: 1, parentId: null, isSystem: true },
    { id: 2, title: '설비 관리', titleKey: 'NavMenu.equipment', path: null, icon: 'Engineering', order: 2, parentId: null, isSystem: true },
    { id: 3, title: '설비 목록', titleKey: 'NavMenu.equipmentList', path: '/equipment', icon: 'Engineering', order: 3, parentId: 2, isSystem: true },
    { id: 4, title: '설비 등록', titleKey: 'NavMenu.equipmentNew', path: '/equipment/new', icon: 'Engineering', order: 4, parentId: 2, isSystem: true },
    { id: 5, title: '보고서', titleKey: 'NavMenu.reports', path: '/reports', icon: 'Assessment', order: 5, parentId: null, isSystem: true },
    { id: 6, title: '설정', titleKey: 'NavMenu.settings', path: null, icon: 'Settings', order: 6, parentId: null, isSystem: true },
    { id: 7, title: '시스템 관리', titleKey: 'NavMenu.system', path: null, icon: 'SystemSettings', order: 9, parentId: null, isSystem: true },
    { id: 8, title: '사용자 관리', titleKey: 'NavMenu.adminUsers', path: '/admin/users', icon: 'People', order: 1, parentId: 7, isSystem: true },
    { id: 9, title: '코드 관리', titleKey: 'NavMenu.adminCodes', path: '/admin/codes', icon: 'Code', order: 2, parentId: 7, isSystem: true },
    { id: 10, title: '권한 관리', titleKey: 'NavMenu.adminPermissions', path: '/admin/permissions', icon: 'Security', order: 3, parentId: 7, isSystem: true },
    { id: 11, title: '역할 관리', titleKey: 'NavMenu.adminRoles', path: '/admin/roles', icon: 'Groups', order: 4, parentId: 7, isSystem: true },
    { id: 12, title: '메뉴 관리', titleKey: 'NavMenu.adminMenus', path: '/admin/menus', icon: 'Menu', order: 5, parentId: 7, isSystem: true },
    { id: 13, title: '장비 제어', titleKey: 'NavMenu.deviceControl', path: '/devicecontrol', icon: 'Engineering', order: 7, parentId: null, isSystem: false },
    { id: 14, title: '디바이스 관리', titleKey: 'NavMenu.devices', path: '/device', icon: 'Settings', order: 8, parentId: null, isSystem: false },
  ],

  // 기본 관리자 계정
  adminUser: {
    id: 'admin',
    password: '1234', // 실제 운영시에는 더 강력한 비밀번호 사용
    email: 'admin@admin.co.kr',
    name: '관리자',
  },

  // 역할별 권한 매핑
  rolePermissionMapping: {
    ADMIN: 'ALL', // 모든 권한
    MANAGER: [
      'dashboard.read',
      'equipment.read',
      'equipment.create',
      'equipment.update',
      'equipment.delete',
      'reports.read',
      'reports.create',
      'reports.export',
    ],
    USER: [
      'dashboard.read',
      'equipment.read',
      'reports.read',
    ],
  },

  // 메뉴별 필요 권한
  menuPermissionMapping: [
    { menuId: 1, permissionName: 'dashboard.read' },
    { menuId: 2, permissionName: 'equipment.read' },
    { menuId: 3, permissionName: 'equipment.read' },
    { menuId: 4, permissionName: 'equipment.create' },
    { menuId: 5, permissionName: 'reports.read' },
    { menuId: 6, permissionName: 'setting.read' },
    { menuId: 7, permissionName: 'user.read' },
    { menuId: 8, permissionName: 'user.read' },
    { menuId: 9, permissionName: 'code.read' },
    { menuId: 10, permissionName: 'permission.read' },
    { menuId: 11, permissionName: 'role.read' },
    { menuId: 12, permissionName: 'menu.read' },
    { menuId: 13, permissionName: 'device.control' },
    { menuId: 14, permissionName: 'device.read' },
  ],
}

async function createCodeGroups() {
  console.log('📚 코드 그룹 생성 중...')
  
  for (const codeGroup of SEED_DATA.codeGroups) {
    await prisma.codeGroup.upsert({
      where: { groupCode: codeGroup.groupCode },
      update: {},
      create: codeGroup,
    })
  }
  
  console.log(`✅ ${SEED_DATA.codeGroups.length}개 코드 그룹 생성 완료`)
}

async function createPermissionCategoryCodes() {
  console.log('🏷️  권한 카테고리 코드 생성 중...')
  
  const permissionCategoryGroup = await prisma.codeGroup.findUnique({
    where: { groupCode: 'PERMISSION_CATEGORY' }
  })
  
  if (!permissionCategoryGroup) {
    throw new Error('PERMISSION_CATEGORY 그룹을 찾을 수 없습니다.')
  }
  
  const categoryCodes: Record<string, Code> = {}
  
  for (const categoryCode of SEED_DATA.permissionCategoryCodes) {
    const code = await prisma.code.upsert({
      where: {
        groupId_code: {
          groupId: permissionCategoryGroup.id,
          code: categoryCode.code,
        }
      },
      update: {},
      create: {
        groupId: permissionCategoryGroup.id,
        ...categoryCode,
      },
    })
    
    categoryCodes[categoryCode.code] = code
  }
  
  console.log(`✅ ${SEED_DATA.permissionCategoryCodes.length}개 권한 카테고리 코드 생성 완료`)
  return categoryCodes
}

async function createRoles() {
  console.log('📋 역할 생성 중...')
  const roles: Record<string, Role> = {}
  
  for (const roleData of SEED_DATA.roles) {
    roles[roleData.name] = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    })
  }
  
  console.log(`✅ ${SEED_DATA.roles.length}개 역할 생성 완료`)
  return roles
}

async function createPermissions(categoryCodes: Record<string, Code>) {
  console.log('🔐 권한 생성 중...')
  
  for (const permission of SEED_DATA.permissions) {
    const categoryCode = categoryCodes[permission.categoryCode]
    
    if (!categoryCode) {
      console.warn(`⚠️  카테고리 코드 '${permission.categoryCode}'를 찾을 수 없습니다.`)
      continue
    }
    
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: {
        name: permission.name,
        displayName: permission.displayName,
        categoryId: categoryCode.id,
        isSystem: permission.isSystem,
      },
    })
  }
  
  console.log(`✅ ${SEED_DATA.permissions.length}개 권한 생성 완료`)
}

async function createMenus() {
  console.log('🧭 메뉴 생성 중...')
  
  for (const menu of SEED_DATA.menus) {
    await prisma.menu.upsert({
      where: { id: menu.id },
      update: {},
      create: {
        ...menu,
        isSystem: menu.isSystem,
      },
    })
  }
  
  console.log(`✅ ${SEED_DATA.menus.length}개 메뉴 생성 완료`)
}

async function createAdminUser(adminRole: Role) {
  console.log('👤 기본 관리자 계정 생성 중...')
  
  // 비밀번호 해시화
  const hashedPassword = await bcrypt.hash(SEED_DATA.adminUser.password, 12)
  
  const adminUser = await prisma.user.upsert({
    where: { id: SEED_DATA.adminUser.id },
    update: {},
    create: {
      ...SEED_DATA.adminUser,
      password: hashedPassword,
      roleId: adminRole.id,
      isSystem: true,
    },
  })
  
  console.log(`✅ 관리자 계정 생성 완료 - ${adminUser.id} (${adminUser.email})`)
  console.log(`⚠️  초기 비밀번호: ${SEED_DATA.adminUser.password}`)
  
  return adminUser
}

async function assignRolePermissions(roles: Record<string, Role>) {
  console.log('🔗 역할별 권한 할당 중...')
  
  for (const [roleName, permissions] of Object.entries(SEED_DATA.rolePermissionMapping)) {
    const role = roles[roleName]
    if (!role) continue

    const permissionNames = permissions === 'ALL' 
      ? SEED_DATA.permissions.map(p => p.name)
      : permissions as string[]

    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })
      
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        })
      }
    }
  }
  
  console.log('✅ 역할별 권한 할당 완료')
}

async function assignMenuPermissions() {
  console.log('🔗 메뉴별 권한 할당 중...')
  
  for (const menuPermission of SEED_DATA.menuPermissionMapping) {
    const permission = await prisma.permission.findUnique({
      where: { name: menuPermission.permissionName }
    })
    
    if (permission) {
      await prisma.menuPermission.upsert({
        where: {
          menuId_permissionId: {
            menuId: menuPermission.menuId,
            permissionId: permission.id,
          }
        },
        update: {},
        create: {
          menuId: menuPermission.menuId,
          permissionId: permission.id,
        },
      })
    }
  }
  
  console.log('✅ 메뉴별 권한 할당 완료')
}

async function main() {
  console.log('🚀 시드 데이터 생성을 시작합니다...\n')
  
  try {
    // 1. 코드 그룹 생성
    await createCodeGroups()

    // 2. 권한 카테고리 코드 생성
    const categoryCodes = await createPermissionCategoryCodes()

    // 3. 역할 생성
    const roles = await createRoles()
    
    // 4. 권한 생성 (카테고리 코드 연결)
    await createPermissions(categoryCodes)
    
    // 5. 메뉴 생성
    await createMenus()
    
    // 6. 기본 관리자 계정 생성
    await createAdminUser(roles.ADMIN)
    
    // 7. 역할별 권한 할당
    await assignRolePermissions(roles)
    
    // 8. 메뉴별 권한 할당
    await assignMenuPermissions()
    
    console.log('\n🎉 시드 데이터 생성이 성공적으로 완료되었습니다!')
    console.log('\n📊 생성된 데이터 요약:')
    console.log(`- 코드 그룹: ${SEED_DATA.codeGroups.length}개`)
    console.log(`- 권한 카테고리: ${SEED_DATA.permissionCategoryCodes.length}개`)
    console.log(`- 역할: ${SEED_DATA.roles.length}개`)
    console.log(`- 권한: ${SEED_DATA.permissions.length}개`)
    console.log(`- 메뉴: ${SEED_DATA.menus.length}개`)
    console.log('- 관리자 계정: 1개')
    console.log('\n⚠️  보안 알림: 운영 환경에서는 관리자 비밀번호를 반드시 변경하세요!')
    
  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류 발생:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })