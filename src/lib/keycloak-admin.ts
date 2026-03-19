// lib/keycloak-admin.ts
// Keycloak Admin API 유틸리티
// DB의 권한과 역할을 Keycloak에 동기화하기 위한 헬퍼 함수

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://localhost:8080";
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER || "";
const KEYCLOAK_REALM = 
  process.env.KEYCLOAK_REALM || 
  (KEYCLOAK_ISSUER.match(/\/realms\/([^\/]+)/)?.[1]) || 
  "nextcube";
const KEYCLOAK_ADMIN_CLIENT_ID = process.env.KEYCLOAK_ADMIN_CLIENT_ID || "admin-cli";
const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET || "";
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "nextjs-app";

interface KeycloakRole {
  id?: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

interface KeycloakClient {
  id: string;
  clientId: string;
}

interface KeycloakUser {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  attributes?: Record<string, string[]>;
  credentials?: Array<{
    type: string;
    value: string;
    temporary: boolean;
  }>;
}

/**
 * Keycloak Admin Access Token 획득
 */
async function getAdminAccessToken(): Promise<string> {
  const tokenUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: KEYCLOAK_ADMIN_CLIENT_ID,
      client_secret: KEYCLOAK_ADMIN_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Keycloak Admin Token 획득 실패: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Keycloak Client ID로 Client UUID 조회
 */
async function getClientUuid(accessToken: string): Promise<string> {
  // clientId 쿼리 파라미터를 사용하여 직접 조회 (더 효율적)
  const clientsUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients?clientId=${encodeURIComponent(KEYCLOAK_CLIENT_ID)}`;
  
  const response = await fetch(clientsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Client 조회 실패: ${response.statusText}`);
  }

  const clients: KeycloakClient[] = await response.json();
  const client = Array.isArray(clients) ? clients[0] : clients;
  
  if (!client || !client.id) {
    throw new Error(`Client '${KEYCLOAK_CLIENT_ID}'를 찾을 수 없습니다.`);
  }

  return client.id;
}

/**
 * Keycloak Realm Role 생성 또는 업데이트
 */
export async function syncRealmRole(roleName: string, description?: string): Promise<void> {
  const accessToken = await getAdminAccessToken();
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`;

  // 기존 역할 확인
  const checkResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const roleData: KeycloakRole = {
    name: roleName,
    description: description || "",
    composite: false,
    clientRole: false,
  };

  if (checkResponse.ok) {
    // 역할 업데이트
    const updateResponse = await fetch(roleUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    if (!updateResponse.ok) {
      throw new Error(`Realm Role 업데이트 실패: ${roleName}`);
    }
  } else {
    // 역할 생성
    const createUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles`;
    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Realm Role 생성 실패: ${roleName} - ${error}`);
    }
  }
}

/**
 * Keycloak Client Role 생성 또는 업데이트
 */
export async function syncClientRole(roleName: string, description?: string): Promise<void> {
  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles/${roleName}`;

  // 기존 역할 확인
  const checkResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const roleData: KeycloakRole = {
    name: roleName,
    description: description || "",
    composite: false,
    clientRole: true,
    containerId: clientUuid,
  };

  if (checkResponse.ok) {
    // 역할 업데이트
    const updateResponse = await fetch(roleUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    if (!updateResponse.ok) {
      throw new Error(`Client Role 업데이트 실패: ${roleName}`);
    }
  } else {
    // 역할 생성
    const createUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles`;
    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Client Role 생성 실패: ${roleName} - ${error}`);
    }
  }
}

/**
 * Realm Role에 Client Role 할당
 */
export async function assignClientRolesToRealmRole(
  realmRoleName: string,
  clientRoleNames: string[]
): Promise<void> {
  if (clientRoleNames.length === 0) return;

  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);

  // Client Role들을 조회
  const clientRolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles`;
  const rolesResponse = await fetch(clientRolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!rolesResponse.ok) {
    throw new Error(`Client Role 목록 조회 실패`);
  }

  const allClientRoles: KeycloakRole[] = await rolesResponse.json();
  const rolesToAssign = allClientRoles.filter((role) =>
    clientRoleNames.includes(role.name)
  );

  if (rolesToAssign.length === 0) {
    return;
  }

  // Realm Role에 Client Role 할당
  const assignUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${realmRoleName}/composites`;
  const assignResponse = await fetch(assignUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolesToAssign),
  });

  if (!assignResponse.ok) {
    const error = await assignResponse.text();
    throw new Error(`Realm Role에 Client Role 할당 실패: ${realmRoleName} - ${error}`);
  }
}

/**
 * Realm Role에서 Client Role 제거
 */
export async function removeClientRolesFromRealmRole(
  realmRoleName: string,
  clientRoleNames: string[]
): Promise<void> {
  if (clientRoleNames.length === 0) return;

  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);

  // Client Role들을 조회
  const clientRolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles`;
  const rolesResponse = await fetch(clientRolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!rolesResponse.ok) {
    throw new Error(`Client Role 목록 조회 실패`);
  }

  const allClientRoles: KeycloakRole[] = await rolesResponse.json();
  const rolesToRemove = allClientRoles.filter((role) =>
    clientRoleNames.includes(role.name)
  );

  if (rolesToRemove.length === 0) {
    return;
  }

  // Realm Role에서 Client Role 제거
  const removeUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${realmRoleName}/composites`;
  const removeResponse = await fetch(removeUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolesToRemove),
  });

  if (!removeResponse.ok) {
    // 404는 이미 제거된 경우이므로 무시
    if (removeResponse.status !== 404) {
      const error = await removeResponse.text();
      throw new Error(`Realm Role에서 Client Role 제거 실패: ${realmRoleName} - ${error}`);
    }
  }
}

/**
 * Realm Role의 현재 Client Role 목록 조회
 */
export async function getRealmRoleClientRoles(realmRoleName: string): Promise<string[]> {
  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  
  const compositesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${realmRoleName}/composites/clients/${clientUuid}`;
  const response = await fetch(compositesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Realm Role의 Client Role 조회 실패: ${realmRoleName}`);
  }

  const roles: KeycloakRole[] = await response.json();
  return roles.map((role) => role.name);
}

/**
 * Keycloak Client Role 삭제
 * 권한 비활성화 또는 삭제 시 사용
 */
export async function deleteClientRole(roleName: string): Promise<void> {
  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles/${roleName}`;

  // 기존 역할 확인
  const checkResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 역할이 존재하지 않으면 성공으로 처리 (이미 삭제된 경우)
  if (!checkResponse.ok) {
    if (checkResponse.status === 404) {
      return; // 이미 삭제된 경우
    }
    throw new Error(`Client Role 조회 실패: ${roleName}`);
  }

  // 역할 삭제
  const deleteResponse = await fetch(roleUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!deleteResponse.ok) {
    // 404는 이미 삭제된 경우이므로 무시
    if (deleteResponse.status !== 404) {
      const error = await deleteResponse.text();
      throw new Error(`Client Role 삭제 실패: ${roleName} - ${error}`);
    }
  }
}

/**
 * Keycloak Realm Role 삭제
 * 역할 삭제 시 사용
 */
export async function deleteRealmRole(roleName: string): Promise<void> {
  const accessToken = await getAdminAccessToken();
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`;

  // 기존 역할 확인
  const checkResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 역할이 존재하지 않으면 성공으로 처리 (이미 삭제된 경우)
  if (!checkResponse.ok) {
    if (checkResponse.status === 404) {
      return; // 이미 삭제된 경우
    }
    throw new Error(`Realm Role 조회 실패: ${roleName}`);
  }

  // 역할 삭제
  const deleteResponse = await fetch(roleUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!deleteResponse.ok) {
    // 404는 이미 삭제된 경우이므로 무시
    if (deleteResponse.status !== 404) {
      const error = await deleteResponse.text();
      throw new Error(`Realm Role 삭제 실패: ${roleName} - ${error}`);
    }
  }
}

// ============================================
// 사용자 관리 함수들
// ============================================

/**
 * Keycloak에서 사용자 ID로 사용자 조회
 */
async function getKeycloakUserByUsername(accessToken: string, username: string): Promise<KeycloakUser | null> {
  const usersUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?username=${encodeURIComponent(username)}&exact=true`;
  
  const response = await fetch(usersUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`사용자 조회 실패: ${response.statusText}`);
  }

  const users: KeycloakUser[] = await response.json();
  return users.length > 0 ? users[0] : null;
}

/**
 * Keycloak 사용자 생성
 */
export async function createKeycloakUser(
  username: string,
  email: string,
  name: string,
  password: string,
  enabled: boolean = true
): Promise<string> {
  const accessToken = await getAdminAccessToken();
  const usersUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`;

  const userData: KeycloakUser = {
    username,
    email,
    firstName: name.length >= 2 ? name.slice(1) : name,
    lastName: name.length >= 1 ? name.slice(0, 1) : "",
    enabled,
    emailVerified: false,
    credentials: password ? [{
      type: "password",
      value: password,
      temporary: false,
    }] : undefined,
  };

  const createResponse = await fetch(usersUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Keycloak 사용자 생성 실패: ${username} - ${error}`);
  }

  // Location 헤더에서 사용자 ID 추출
  const location = createResponse.headers.get("Location");
  if (location) {
    const userId = location.split("/").pop();
    return userId || username;
  }

  return username;
}

/**
 * Keycloak 사용자 정보 업데이트
 */
export async function updateKeycloakUser(
  username: string,
  email?: string,
  name?: string,
  enabled?: boolean
): Promise<void> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    throw new Error(`Keycloak에서 사용자를 찾을 수 없습니다: ${username}`);
  }

  const userUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}`;

  // 기존 사용자 정보를 기반으로 병합 (PUT은 전체 교체이므로 기존 정보 유지 필요)
  const userData: KeycloakUser = {
    ...existingUser, // 기존 사용자 정보 유지
    username,
    ...(email !== undefined && { email }),
    ...(name !== undefined && { 
      firstName: name.length >= 2 ? name.slice(1) : name,
      lastName: name.length >= 1 ? name.slice(0, 1) : ""
    }),
    ...(enabled !== undefined && { enabled }),
  };

  delete userData.credentials;

  console.log("userData", userData);

  const updateResponse = await fetch(userUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!updateResponse.ok) {
    const error = await updateResponse.text();
    throw new Error(`Keycloak 사용자 업데이트 실패: ${username} - ${error}`);
  }
}

/**
 * Keycloak 사용자 비밀번호 설정
 */
export async function setKeycloakUserPassword(
  username: string,
  password: string,
  temporary: boolean = false
): Promise<void> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    throw new Error(`Keycloak에서 사용자를 찾을 수 없습니다: ${username}`);
  }

  const passwordUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/reset-password`;

  const passwordData = {
    type: "password",
    value: password,
    temporary,
  };

  const response = await fetch(passwordUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Keycloak 사용자 비밀번호 설정 실패: ${username} - ${error}`);
  }
}

/**
 * Keycloak 사용자 삭제
 */
export async function deleteKeycloakUser(username: string): Promise<void> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  
  // 사용자가 존재하지 않으면 성공으로 처리 (이미 삭제된 경우)
  if (!existingUser || !existingUser.id) {
    return;
  }

  const userUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}`;

  const deleteResponse = await fetch(userUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!deleteResponse.ok) {
    // 404는 이미 삭제된 경우이므로 무시
    if (deleteResponse.status !== 404) {
      const error = await deleteResponse.text();
      throw new Error(`Keycloak 사용자 삭제 실패: ${username} - ${error}`);
    }
  }
}

/**
 * Keycloak 사용자에게 Realm Role 할당
 */
export async function assignRealmRoleToUser(
  username: string,
  roleName: string
): Promise<void> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    throw new Error(`Keycloak에서 사용자를 찾을 수 없습니다: ${username}`);
  }

  // Realm Role 조회
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`;
  const roleResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!roleResponse.ok) {
    throw new Error(`Keycloak에서 역할을 찾을 수 없습니다: ${roleName}`);
  }

  const role: KeycloakRole = await roleResponse.json();

  // 사용자에게 역할 할당
  const assignUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/realm`;
  const assignResponse = await fetch(assignUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([role]),
  });

  if (!assignResponse.ok) {
    const error = await assignResponse.text();
    throw new Error(`Keycloak 사용자 역할 할당 실패: ${username} - ${error}`);
  }
}

/**
 * Keycloak 사용자의 Realm Role 제거
 */
export async function removeRealmRoleFromUser(
  username: string,
  roleName: string
): Promise<void> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    return; // 사용자가 없으면 성공으로 처리
  }

  // Realm Role 조회
  const roleUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`;
  const roleResponse = await fetch(roleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!roleResponse.ok) {
    return; // 역할이 없으면 성공으로 처리
  }

  const role: KeycloakRole = await roleResponse.json();

  // 사용자에게서 역할 제거
  const removeUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/realm`;
  const removeResponse = await fetch(removeUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([role]),
  });

  if (!removeResponse.ok && removeResponse.status !== 404) {
    const error = await removeResponse.text();
    throw new Error(`Keycloak 사용자 역할 제거 실패: ${username} - ${error}`);
  }
}

/**
 * Keycloak 사용자의 현재 Realm Role 목록 조회
 */
export async function getUserRealmRoles(username: string): Promise<string[]> {
  const accessToken = await getAdminAccessToken();
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    return [];
  }

  const rolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/realm`;
  const response = await fetch(rolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Keycloak 사용자 역할 조회 실패: ${username}`);
  }

  const roles: KeycloakRole[] = await response.json();
  return roles.map((role) => role.name);
}

// ============================================
// 사용자 권한(Client Role) 관리 함수들
// ============================================

/**
 * Keycloak 사용자에게 Client Role(권한) 할당
 */
export async function assignClientRolesToUser(
  username: string,
  permissionNames: string[]
): Promise<void> {
  if (permissionNames.length === 0) return;

  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    throw new Error(`Keycloak에서 사용자를 찾을 수 없습니다: ${username}`);
  }

  // Client Role들을 조회
  const clientRolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles`;
  const rolesResponse = await fetch(clientRolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!rolesResponse.ok) {
    throw new Error(`Client Role 목록 조회 실패`);
  }

  const allClientRoles: KeycloakRole[] = await rolesResponse.json();
  const rolesToAssign = allClientRoles.filter((role) =>
    permissionNames.includes(role.name)
  );

  if (rolesToAssign.length === 0) {
    console.warn(`[Keycloak] 할당할 권한을 찾을 수 없습니다: ${permissionNames.join(', ')}`);
    return;
  }

  // 사용자에게 Client Role 할당
  const assignUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/clients/${clientUuid}`;
  const assignResponse = await fetch(assignUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolesToAssign),
  });

  if (!assignResponse.ok) {
    const error = await assignResponse.text();
    throw new Error(`Keycloak 사용자 권한 할당 실패: ${username} - ${error}`);
  }

  console.log(`[Keycloak] 사용자 권한 할당 성공: ${username} - ${permissionNames.join(', ')}`);
}

/**
 * Keycloak 사용자의 Client Role(권한) 제거
 */
export async function removeClientRolesFromUser(
  username: string,
  permissionNames: string[]
): Promise<void> {
  if (permissionNames.length === 0) return;

  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    return; // 사용자가 없으면 성공으로 처리
  }

  // Client Role들을 조회
  const clientRolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${clientUuid}/roles`;
  const rolesResponse = await fetch(clientRolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!rolesResponse.ok) {
    throw new Error(`Client Role 목록 조회 실패`);
  }

  const allClientRoles: KeycloakRole[] = await rolesResponse.json();
  const rolesToRemove = allClientRoles.filter((role) =>
    permissionNames.includes(role.name)
  );

  if (rolesToRemove.length === 0) {
    return;
  }

  // 사용자에게서 Client Role 제거
  const removeUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/clients/${clientUuid}`;
  const removeResponse = await fetch(removeUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolesToRemove),
  });

  if (!removeResponse.ok && removeResponse.status !== 404) {
    const error = await removeResponse.text();
    throw new Error(`Keycloak 사용자 권한 제거 실패: ${username} - ${error}`);
  }

  console.log(`[Keycloak] 사용자 권한 제거 성공: ${username} - ${permissionNames.join(', ')}`);
}

/**
 * Keycloak 사용자의 현재 Client Role(권한) 목록 조회
 */
export async function getUserClientRoles(username: string): Promise<string[]> {
  const accessToken = await getAdminAccessToken();
  const clientUuid = await getClientUuid(accessToken);
  
  // 사용자 조회
  const existingUser = await getKeycloakUserByUsername(accessToken, username);
  if (!existingUser || !existingUser.id) {
    return [];
  }

  const rolesUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${existingUser.id}/role-mappings/clients/${clientUuid}`;
  const response = await fetch(rolesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Keycloak 사용자 권한 조회 실패: ${username}`);
  }

  const roles: KeycloakRole[] = await response.json();
  return roles.map((role) => role.name);
}

