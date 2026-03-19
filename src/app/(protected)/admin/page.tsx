import RoleGuard from "@/lib/auth/RoleGuard";

export default function AdminPage() {
  return (
    <RoleGuard role="ADMIN">
      <div>관리자 페이지입니다</div>
    </RoleGuard>
  );
}
