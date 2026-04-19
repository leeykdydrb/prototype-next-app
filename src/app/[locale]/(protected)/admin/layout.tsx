import PermissionGuard from "@/lib/auth/PermissionGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  console.log("AdminLayout");
  return (
    <PermissionGuard>
      {children}
    </PermissionGuard>
  );
}